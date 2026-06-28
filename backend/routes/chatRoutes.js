const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../controllers/chatController');
// 1. Apna Auth Middleware import karein (path check karlein)
const { protect } = require('../middleware/authMiddleware'); 

// 2. Route ko protect karein
// Ab 'getChatResponse' chalne se pehle 'protect' check karega ke token sahi hai ya nahi
router.post('/', protect, getChatResponse);

module.exports = router;