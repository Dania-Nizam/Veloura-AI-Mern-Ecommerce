const Cart = require('../models/Cart');

// @desc    Update or Create Cart
// @route   POST /api/cart
// 📦 APNA PURANA updateCart ISSE REPLACE KAREIN:
export const updateCart = async (req, res) => {
  // Check both req.body and decoded token (req.user) as fallback
  const userId = req.body.userId || req.user?._id || req.user?.id;
  const { items } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required to sync cart" });
    }

    if (!items) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Dynamic structural upserter strategy to ensure safe db synchronization
    const cart = await Cart.findOneAndUpdate(
      { $or: [{ userId }, { user_id: userId }] }, // Dual field checking guard
      { userId, user_id: userId, items }, // Sync back fields uniformly
      { new: true, upsert: true, runValidators: true }
    ).populate('items.productId', 'name price image');

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};