const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    // User ki pehchan (Kiska cart hai?)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ✨ FIXED: Added user_id field for backward compatibility so older records don't crash strict mode
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    // Items ki list
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        // ✨ FIXED: Added complete product details structure inside schema to match fallback data payload
        name: {
          type: String,
          required: false,
        },
        price: {
          type: Number,
          required: false,
        },
        image: {
          type: String,
          required: false,
        },
        category: {
          type: String,
          required: false,
        },
        countInStock: {
          type: Number,
          required: false,
        },
        description: {
          type: String,
          required: false,
        },
        // ✨ FIXED: Added 'qty' because frontend and controllers are dispatching/reading 'qty'
        qty: {
          type: Number,
          required: true,
          default: 1,
        },
        quantity: {
          type: Number,
          required: false,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true, // Create aur update time track karne ke liye
    strict: false,    // ✨ FIXED: Strict mode is false to ensure any dynamic fields pass without throwing validation errors
  }
);

// Agar pehle se model exist karta hai toh use karein, warna naya banayein
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

module.exports = Cart;