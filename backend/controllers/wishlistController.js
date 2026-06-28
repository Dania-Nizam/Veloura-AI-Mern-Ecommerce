const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// @desc    Get user wishlist
// @route   GET /api/wishlist/:userId (or fallback query/token)
const getWishlist = async (req, res) => {
  try {
    // ✨ FIX: Agar target parameter me ID na ho balki direct call ho, toh fallback check lagayein
    let userId = req.params.userId;

    if (!userId || userId === "undefined" || userId === "null") {
      userId = req.body.userId || req.user?._id;
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required to fetch wishlist" });
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(200).json({ items: [] });
    
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error: error.message });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    // ✨ BULLETPROOF USER ID EXTRACTION
    let finalUserId = userId || req.user?._id;

    // Agar frontend poora userInfo string object directly drop kar raha ho payload me
    if (userId && typeof userId === 'object') {
      finalUserId = userId._id || userId.user?._id;
    }

    if (!finalUserId || !productId) {
      return res.status(400).json({ 
        message: "Bad Request: Missing User ID or Product ID", 
        received: { userId: finalUserId, productId } 
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ userId: finalUserId });

    if (wishlist) {
      // Duplication filter block
      const alreadyExists = wishlist.items.find(
        (item) => item.productId.toString() === productId.toString()
      );

      if (!alreadyExists) {
        wishlist.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
        await wishlist.save();
      }
    } else {
      // Fresh new document creation
      wishlist = await Wishlist.create({
        userId: finalUserId,
        items: [{
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        }]
      });
    }

    res.status(201).json(wishlist);
  } catch (error) {
    console.error("Wishlist Add Error:", error);
    res.status(500).json({ message: "Server error tracking wishlist", error: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:userId/:productId
// @access  Private
const removeFromWishlistDB = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      // Items array me se targeted product ko filter out karein
      wishlist.items = wishlist.items.filter(
        (item) => item.productId.toString() !== productId.toString()
      );
      
      await wishlist.save();
      return res.status(200).json(wishlist);
    } else {
      return res.status(404).json({ message: "Wishlist not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error removing from database", error: error.message });
  }
};

// module.exports me is naye function ko export karna na bhooliyega:
module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlistDB // 👈 Add this
};