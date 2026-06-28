const { protect } = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();
// Dono functions ko ek hi line mein import karein
const { registerUser, loginUser,updateUserProfile,getUsers,deleteUser } = require('../controllers/userController');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, getUsers);
router.delete('/:id', protect, deleteUser);


module.exports = router;