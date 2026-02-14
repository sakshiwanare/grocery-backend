const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item',
          required: true,
        },
        quantity: {
          type: Number, // in grams
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    address: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'UPI', 'CARD'],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED','CANCELLED'],
      default: 'PENDING',
    },
    paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING',
    },
    paymentId: {
    type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
