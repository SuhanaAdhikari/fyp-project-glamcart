const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    cart: {
        type: Array,
        required: true,
    },
    shippingAddress: {
        type: Object,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "Processing",
      
    },
   paymentInfo: {
  id: { type: String },
  type: { type: String, },
  status: { type: String, },
  pidx: { type: String },
  payment_url: { type: String }
},
    paidAt: {
        type: Date,
        default: Date.now(),
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    // Additional tracking fields
    trackingInfo: {
        trackingNumber: {
            type: String
        },
        carrier: {
            type: String
        },
        trackingUrl: {
            type: String
        }
    },
    // Order notes
    orderNotes: {
        type: String,
        maxlength: 500
    },
    // Refund information
    refundInfo: {
        refundAmount: {
            type: Number
        },
        refundReason: {
            type: String
        },
        refundDate: {
            type: Date
        },
        refundTransactionId: {
            type: String
        }
    }
});

module.exports = mongoose.model("Order", orderSchema);