const express = require("express");
const cloudinary = require("cloudinary");
const Banner = require("../model/banner");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

const router = express.Router();

router.get(
  "/get-banner",
  catchAsyncErrors(async (req, res) => {
    const banner = await Banner.findOne().sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      banner,
    });
  })
);

router.get(
  "/admin-banner",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res) => {
    const banner = await Banner.findOne().sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      banner,
    });
  })
);

router.put(
  "/upsert-banner",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { image } = req.body;

    if (!image) {
      return next(new ErrorHandler("Please upload a banner image", 400));
    }

    let banner = await Banner.findOne().sort({ updatedAt: -1 });

    if (banner?.image?.public_id) {
      await cloudinary.v2.uploader.destroy(banner.image.public_id);
    }

    const uploadedImage = await cloudinary.v2.uploader.upload(image, {
      folder: "banners",
    });

    if (!banner) {
      banner = await Banner.create({
        image: {
          public_id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
        },
        updatedBy: req.user._id,
      });
    } else {
      banner.image = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      };
      banner.updatedBy = req.user._id;
      await banner.save();
    }

    res.status(200).json({
      success: true,
      message: "Homepage banner updated successfully!",
      banner,
    });
  })
);

module.exports = router;
