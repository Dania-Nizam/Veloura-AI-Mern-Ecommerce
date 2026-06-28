const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getMyOrders, 
    getOrderById,
    getOrderStatus,
    getOrders ,// Admin controller
    updateOrderToDelivered,
    deleteOrder,
    updateOrderStatus
} = require('../controllers/orderController');

// Middleware import karein
const { protect, admin } = require('../middleware/authMiddleware');

// --- Routes ---

// 1. Base Route (/)
// POST: Naya order banane ke liye (User)
// GET: Saare orders dekhne ke liye (Sirf Admin)
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders); // Admin middleware yahan lazmi hai

// 2. User specific orders
router.route('/myorders').get(protect, getMyOrders);

// 3. Dynamic ID routes (Hamesha niche)
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').get(protect, getOrderStatus);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
// orderRoutes.js


// Order delete karne ka route
router.route('/:id').delete(protect, admin, deleteOrder);

// Ensure this specific path exists
router.route('/:id/status').put(protect, admin, updateOrderStatus);


module.exports = router;