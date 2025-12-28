const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const axios = require("axios");


const KHALTI_CONFIG = {
  BASE_URL: "https://dev.khalti.com/api/v2/epayment",
  SECRET_KEY: process.env.KHALTI_SECRET_KEY || "1867144249c744d3ba060c7de1348c98",
  WEBSITE_URL: "http://localhost:3000", 
  TIMEOUT: 15000,
  MAX_RETRIES: 3,
};

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      // Group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // Create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * .10;
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);
        
        seller.availableBalance = amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


////////////////////////////////////////////////////////////////
//KHALTI ////////////

router.post(
  "/create-order-khalti",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, customerInfo } = req.body;

      if (!cart || !shippingAddress || !user || !totalPrice) {
        return next(new ErrorHandler("Missing required order information", 400));
      }

      // Group cart items by shopId
      const shopItemsMap = new Map();
      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // Create orders but don't mark as paid yet
      const orders = [];
      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo: {
            type: "Khalti",
            status: "Pending"
          },
          status: "Payment Pending"
        });
        orders.push(order);
      }

      // Generate unique order identifier for Khalti
      const orderIds = orders.map(order => order._id.toString()).join(',');
      const productName = `Order from ShoeSphere - ${orders.length} item(s)`;
      
      // Convert amount to paisa (Khalti uses paisa)
      const amountInPaisa = Math.round(totalPrice * 100);

      // Initiate Khalti payment
         const khaltiPayload = {
        return_url: `http://localhost:3000/payment/khalti/verify?orderIds=${orderIds}`,
        website_url: "http://localhost:3000",
        amount: amountInPaisa,
        purchase_order_id: orderIds,
        purchase_order_name: productName,
        customer_info: customerInfo || {
          name: user.name,
          email: user.email,
          phone: user.phoneNumber
        }
      };

      const khaltiResponse = await makeKhaltiApiCall("initiate/", khaltiPayload);

      // Update orders with Khalti payment info
      await Order.updateMany(
        { _id: { $in: orders.map(o => o._id) } },
        { 
          $set: { 
            'paymentInfo.pidx': khaltiResponse.pidx,
            'paymentInfo.payment_url': khaltiResponse.payment_url
          }
        }
      );

      res.status(201).json({
        success: true,
        orders,
        khalti: {
          pidx: khaltiResponse.pidx,
          payment_url: khaltiResponse.payment_url,
          expires_at: khaltiResponse.expires_at
        },
        message: "Order created successfully. Complete payment to confirm."
      });

    } catch (error) {
 console.error("Khalti order creation error:", error, error?.response?.data);
return next(new ErrorHandler(
  error?.response?.data?.detail || error?.message || "Failed to create order with Khalti payment", 
  500
));
    }
  })
);


const makeKhaltiApiCall = async (endpoint, data, retries = KHALTI_CONFIG.MAX_RETRIES) => {
  const url = `${KHALTI_CONFIG.BASE_URL}/${endpoint}`;
  let attempt = 1;
  
  while (attempt <= retries) {
    try {
      console.log(`Khalti API attempt server ma request hanecha hai  ${attempt}: ${url}`, data , );
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Key ${KHALTI_CONFIG.SECRET_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: KHALTI_CONFIG.TIMEOUT,
      });
      return response.data;
    } catch (error) {
      console.error(`Khalti API attempt ${attempt} failed:`, error.response?.data || error.message);
      attempt++;
      if (attempt > retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt)); 
    }
  }
  throw new Error("Khalti API failed after retries");
};

router.post(
  "/khalti/initiate",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { 
        amount, 
        productIdentity, 
        productName, 
        customerInfo,
        returnUrl 
      } = req.body;


      if (!amount || !productIdentity || !productName) {
        return next(new ErrorHandler("Missing required fields: amount, productIdentity, productName", 400));
      }

   
      const amountInPaisa = Math.round(amount * 100);

      const payload = {
    return_url: `${KHALTI_CONFIG.WEBSITE_URL}/payment/khalti/verify`,
        website_url: KHALTI_CONFIG.WEBSITE_URL,
        amount: amountInPaisa,
        purchase_order_id: productIdentity,
        purchase_order_name: productName,
        customer_info: customerInfo || {}
      };

      const response = await makeKhaltiApiCall("initiate/", payload);

      res.status(200).json({
        success: true,
        pidx: response.pidx,
        payment_url: response.payment_url,
        expires_at: response.expires_at,
        message: "Khalti payment initiated successfully"
      });

    } catch (error) {
      console.error("Khalti initiation error:", error);
      return next(new ErrorHandler(
        error.response?.data?.detail || "Failed to initiate Khalti payment", 
        500
      ));
    }
  })
);


router.post(
  "payment/khalti/verify",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { pidx, orderId } = req.body;

      if (!pidx) {
        return next(new ErrorHandler("Missing pidx parameter", 400));
      }

      // Lookup payment status from Khalti
      const verificationResponse = await makeKhaltiApiCall("lookup/", { pidx });

      if (verificationResponse.status === "Completed") {
        // Payment successful
        const paymentInfo = {
          id: verificationResponse.transaction_id,
          status: "Completed",
          type: "Khalti",
          pidx: pidx,
          amount: verificationResponse.total_amount,
          fee: verificationResponse.fee
        };

        res.status(200).json({
          success: true,
          message: "Payment verified successfully",
          paymentInfo: paymentInfo,
          transactionDetails: verificationResponse
        });

      } else if (verificationResponse.status === "Pending") {
        res.status(202).json({
          success: false,
          message: "Payment is still pending",
          status: verificationResponse.status
        });

      } else {
        res.status(400).json({
          success: false,
          message: "Payment verification failed",
          status: verificationResponse.status,
          details: verificationResponse
        });
      }

    } catch (error) {
      console.error("Khalti verification error:", error);
      return next(new ErrorHandler(
        error.response?.data?.detail || "Failed to verify Khalti payment", 
        500
      ));
    }
  })
);



// Verify Khalti payment and update order
router.post(
  "/verify-khalti-payment",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { pidx, orderIds } = req.body;

      if (!pidx || !orderIds) {
        return next(new ErrorHandler("Missing pidx or orderIds", 400));
      }

      // Verify payment with Khalti
      const verificationResponse = await makeKhaltiApiCall("lookup/", { pidx });

      if (verificationResponse.status === "Completed") {
        // Payment successful - update orders
        const orderIdArray = orderIds.split(',');
        
        const updateResult = await Order.updateMany(
          { _id: { $in: orderIdArray } },
          {
            $set: {
              'paymentInfo.id': verificationResponse.transaction_id,
              'paymentInfo.status': 'Completed',
              'paymentInfo.khalti_fee': verificationResponse.fee,
              status: 'Processing',
              paidAt: new Date()
            }
          }
        );

        const updatedOrders = await Order.find({ _id: { $in: orderIdArray } });

        res.status(200).json({
          success: true,
          message: "Payment verified and orders updated successfully",
          orders: updatedOrders,
          transactionDetails: verificationResponse
        });

      } else {
        res.status(400).json({
          success: false,
          message: "Payment verification failed",
          status: verificationResponse.status
        });
      }

    } catch (error) {
      console.error("Khalti payment verification error:", error);
      return next(new ErrorHandler(
        error.response?.data?.detail || "Failed to verify Khalti payment", 
        500
      ));
    }
  })
);

// Check Khalti payment status
router.get(
  "/khalti-status/:pidx",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { pidx } = req.params;

      if (!pidx) {
        return next(new ErrorHandler("Missing pidx parameter", 400));
      }

      const response = await makeKhaltiApiCall("lookup/", { pidx });

      // Find orders with this pidx
      const orders = await Order.find({ 'paymentInfo.pidx': pidx });

      res.status(200).json({
        success: true,
        khaltiStatus: response.status,
        orders: orders,
        paymentDetails: response
      });

    } catch (error) {
      console.error("Khalti status check error:", error);
      return next(new ErrorHandler(
        error.response?.data?.detail || "Failed to check payment status", 
        500
      ));
    }
  })
);
///////////////////////////////////////////////////////////////

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
