const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String },
        price: { type: Number },
        image: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;