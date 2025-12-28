const Messages = require("../model/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const cloudinary = require("cloudinary");
const sharp = require("sharp");
const streamifier = require("streamifier");
const router = express.Router();

// Helper function to upload compressed buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "messages",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// ✅ create new message with compressed image
router.post(
  "/create-new-message",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messageData = req.body;

      if (messageData.images) {
        const base64Data = messageData.images.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const compressedBuffer = await sharp(buffer)
          .resize({ width: 1024 }) // Optional: limit width
          .jpeg({ quality: 70 })   // Optional: compress
          .toBuffer();

        const uploaded = await uploadToCloudinary(compressedBuffer);

        messageData.images = {
          public_id: uploaded.public_id,
          url: uploaded.secure_url,
        };
      }

      const message = new Messages({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images || undefined,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

// get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

module.exports = router;
