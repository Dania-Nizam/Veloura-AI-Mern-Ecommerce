const express = require("express");
const router = express.Router();

// 📁 Controller se saare methods import kiye
const { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlistDB 
} = require("../controllers/wishlistController");

// 🚀 POST: /api/wishlist (Wishlist me item add karne ke liye)
router.route("/")
  .post(addToWishlist);

// 🔍 GET: /api/wishlist/:userId (User ki wishlist fetch karne ke liye)
router.route("/:userId")
  .get(getWishlist);

// ✨ DELETE: /api/wishlist/:userId/:productId (Move to bag ya delete karne ke liye)
router.route("/:userId/:productId")
  .delete(removeFromWishlistDB);

module.exports = router;