const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const { initiateKhaltiPayment, lookupKhaltiPayment } = require("../utils/khalti");
const KHALTI_CONFIG = require("../config/khaltiConfig");

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
    let orders = [];

    try {
      const { cart, shippingAddress, user, totalPrice, customerInfo } = req.body;

      if (!cart || !shippingAddress || !user || !totalPrice) {
        return next(new ErrorHandler("Missing required order information", 400));
      }

      const totalPriceNumber = Number(totalPrice);
      if (!Number.isFinite(totalPriceNumber) || totalPriceNumber <= 0) {
        return next(new ErrorHandler("Invalid totalPrice for Khalti payment", 400));
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
      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice: totalPriceNumber,
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
      const purchaseOrderId = `khalti-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      
      // Convert amount to paisa (Khalti uses paisa)
      const amountInPaisa = Math.max(Math.round(totalPriceNumber * 100), 1000);

      const customerInfoPayload = {};
      if (customerInfo?.name || user?.name) {
        customerInfoPayload.name = customerInfo?.name || user?.name;
      }
      if (customerInfo?.email || user?.email) {
        customerInfoPayload.email = customerInfo?.email || user?.email;
      }
      if (customerInfo?.phone || user?.phoneNumber) {
        customerInfoPayload.phone = String(customerInfo?.phone || user?.phoneNumber);
      }

      const khaltiResponse = await initiateKhaltiPayment({
        amount: amountInPaisa,
        purchaseOrderId,
        purchaseOrderName: productName,
        returnUrl: `${KHALTI_CONFIG.FRONTEND_URL}/payment/khalti/verify?orderIds=${encodeURIComponent(orderIds)}`,
        websiteUrl: KHALTI_CONFIG.FRONTEND_URL,
        customerInfo: customerInfoPayload,
      });

      // Update orders with Khalti payment info
      await Order.updateMany(
        { _id: { $in: orders.map(o => o._id) } },
        { 
          $set: { 
            'paymentInfo.pidx': khaltiResponse.pidx,
            'paymentInfo.payment_url': khaltiResponse.payment_url,
            'paymentInfo.purchaseOrderId': purchaseOrderId,
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
      console.error("Khalti order creation error:", error.response?.data || error.message || error);
      if (orders.length) {
        await Order.deleteMany({ _id: { $in: orders.map((o) => o._id) } });
      }
      return next(
        new ErrorHandler(
          error?.response?.data?.detail || error?.message || "Failed to create order with Khalti payment",
          500
        )
      );
    }
  })
);


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

      const response = await initiateKhaltiPayment({
        amount: amountInPaisa,
        purchaseOrderId: productIdentity,
        purchaseOrderName: productName,
        returnUrl: `${KHALTI_CONFIG.FRONTEND_URL}/payment/khalti/verify`,
        websiteUrl: KHALTI_CONFIG.FRONTEND_URL,
        customerInfo: {
          ...customerInfo,
          phone: String(customerInfo?.phone || ""),
        },
      });

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





// Verify Khalti payment and update order
router.post(
  ["/verify-khalti-payment", "/khalti/verify"],
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { pidx, orderIds } = req.body;

      if (!pidx || !orderIds) {
        return next(new ErrorHandler("Missing pidx or orderIds", 400));
      }

      // Verify payment with Khalti
      const verificationResponse = await lookupKhaltiPayment(pidx);
      const orderIdArray = orderIds.split(',');
      const status = verificationResponse.status;

      let paymentInfoStatus = status;
      let orderStatus = 'Payment Pending';
      let isCompleted = false;

      if (status === 'Completed') {
        paymentInfoStatus = 'Succeeded';
        orderStatus = 'Processing';
        isCompleted = true;
      } else if (status === 'Failed') {
        paymentInfoStatus = 'Failed';
        orderStatus = 'Payment Failed';
      } else if (status === 'Expired') {
        paymentInfoStatus = 'Expired';
        orderStatus = 'Payment Expired';
      } else if (status === 'Canceled' || status === 'Cancelled') {
        paymentInfoStatus = 'Canceled';
        orderStatus = 'Payment Canceled';
      } else {
        paymentInfoStatus = status;
        orderStatus = 'Payment Pending';
      }

      await Order.updateMany(
        { _id: { $in: orderIdArray } },
        {
          $set: {
            'paymentInfo.id': verificationResponse.transaction_id || pidx,
            'paymentInfo.type': 'Khalti',
            'paymentInfo.status': paymentInfoStatus,
            'paymentInfo.khalti_fee': verificationResponse.fee || 0,
            status: orderStatus,
            ...(isCompleted && { paidAt: new Date() }),
          }
        }
      );

      const updatedOrders = await Order.find({ _id: { $in: orderIdArray } });

      res.status(isCompleted ? 200 : 400).json({
        success: isCompleted,
        message: isCompleted
          ? 'Payment verified and orders updated successfully'
          : `Payment ${status}`,
        status,
        orders: updatedOrders,
        transactionDetails: verificationResponse,
      });

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

      const response = await lookupKhaltiPayment(pidx);

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
