const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// 🔄 Sync Cart Logic
router.post("/", async (req, res) => {
  const { userId, items } = req.body; 

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✨ FIXED: Data map kiya taaki 'qty', 'quantity' aur saari product details (name, price, etc.) DB mein safely save hon
    const formattedItems = Array.isArray(items) ? items.map(item => {
      const itemQty = Number(item.qty || item.quantity || 1);
      
      // Extract pure string ID from item structure to guarantee reference alignment
      let rawProductId = item.productId;
      if (rawProductId && typeof rawProductId === 'object') {
        rawProductId = rawProductId._id || rawProductId.id;
      } else if (!rawProductId) {
        rawProductId = item._id;
      }

      return {
        productId: rawProductId,
        qty: itemQty,
        quantity: itemQty, // Dono keys inject ki hain safety ke liye
        // ✨ FIXED: Added explicit mapping so details are physically written to the database document
        name: item.name,
        price: Number(item.price || 0),
        image: item.image,
        category: item.category,
        countInStock: Number(item.countInStock || 0),
        description: item.description
      };
    }) : [];

    // ✨ FIXED: $or condition se filter lagaya taaki kisi bhi key par record mile, toh naya data 'items' array mein overwrite ho jaye
    let cart = await Cart.findOneAndUpdate(
      { $or: [{ userId }, { user_id: userId }] },
      { userId, user_id: userId, items: formattedItems }, // Explicitly updating tracking keys
      { new: true, upsert: true, runValidators: false } // runValidators false kiya taaki schema options clash na karein
    ).populate({
      path: 'items.productId',
      select: 'name price image category countInStock description' 
    });

    console.log("🚀 Cart synced in DB successfully for user:", userId);
    res.status(200).json(cart); 

  } catch (error) {
    console.error("Backend Sync Error:", error);
    res.status(500).json({ message: "Error syncing cart", error: error.message });
  }
});

// 📥 GET Cart Logic
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      $or: [{ userId: req.params.userId }, { user_id: req.params.userId }]
    }).populate({
      path: 'items.productId',
      select: 'name price image category countInStock description'
    });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    
    res.status(200).json(cart);
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

module.exports = router;