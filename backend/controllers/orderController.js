const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');


const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        try {
            const order = new Order({
                user: req.user._id, // Auth middleware se user ID
                orderItems,
                shippingAddress,
                paymentMethod,
                totalPrice,
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};


const getOrderById = async (req, res) => {
  try {
    // .populate('user', 'name email') se user ki details bhi mil jayengi
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};
const getOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

  if (order) {
    res.json({
      id: order._id,
      status: order.status || "Order Placed",
      updatedAt: order.updatedAt
    });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders (for Admin Dashboard)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    // .populate('user', 'id name') isliye taake dashboard par customer ka naam nazar aaye
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// orderController.js
const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.deleteOne(); // Ya Order.findByIdAndDelete(req.params.id)
    res.json({ message: 'Order removed' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};



const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Frontend se jo bhi status aaye, use direct save karein
    order.status = req.body.status || order.status;
    
    // Agar status Delivered ho, to isPaid aur deliveredAt ko bhi update kar sakte hain
    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = { addOrderItems, getMyOrders ,getOrderById,getOrderStatus,getOrders,updateOrderToDelivered,deleteOrder,updateOrderStatus};