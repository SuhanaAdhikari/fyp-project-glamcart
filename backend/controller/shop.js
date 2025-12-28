const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

// create shop
router.post("/create-shop", catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar, address, phoneNumber, zipCode } = req.body;

  const shopExists = await Shop.findOne({ email });
  if (shopExists) return next(new ErrorHandler("User already exists", 400));

  const result = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars" });

  const newShop = {
    name, email, password, address, phoneNumber, zipCode,
    avatar: { public_id: result.public_id, url: result.secure_url }
  };

  const activationToken = jwt.sign(newShop, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
  const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

  await sendMail({
    email,
    subject: "Activate Your Seller Account",
    message: `Hi ${name}, activate your seller account: ${activationUrl}`
  });

  res.status(201).json({ success: true, message: `Activation email sent to ${email}` });
}));


// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5d",
  });
};

// activate user
// activate seller from token in URL
// ✅ Updated Shop Activation Route to match frontend
router.get("/activation/:token", catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);

  const existingShop = await Shop.findOne({ email: decoded.email });
  if (existingShop) return next(new ErrorHandler("Seller already exists", 400));

  const createdShop = await Shop.create(decoded);
  sendShopToken(createdShop, 201, res);
}));


//login shop

router.post('/login-shop', catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please provide the all fields", 400));
        }
        const user = await Shop.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("User doesn't exists!", 400));
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return next(new ErrorHandler("Please provide the correct information", 400));
        }
        sendShopToken(user, 201, res);
      }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));


//Load shop
router.get("/getseller", isSeller, catchAsyncErrors(async (req, res, next) => {
  const seller = await Shop.findById(req.seller._id);
  if (!seller) return next(new ErrorHandler("Seller not found", 404));

  res.status(200).json({ success: true, seller });
}));

// logout from shop  
router.get("/logout", (req, res) => {
  res.clearCookie("seller_token", {
    httpOnly: true,
    secure: true,          // Use `false` for localhost (unless using HTTPS)
    sameSite: "none",      // Or "lax" if same-origin
  });
  res.status(200).json({ success: true, message: "Logout successful" });
});

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsSeller = await Shop.findById(req.seller._id);

        const imageId = existsSeller.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
        });

        existsSeller.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };

  
      await existsSeller.save();

      res.status(200).json({
        success: true,
        seller:existsSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
