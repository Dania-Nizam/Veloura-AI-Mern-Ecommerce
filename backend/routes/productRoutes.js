const express = require('express');
const router = express.Router();

// Saare functions ko ek hi baar import karein
const { addProduct, getProducts, deleteProduct,updateProduct,getProductById,getBestSellers,getProductsByCategory,getFashionProducts,getHotDeals,getFragrances, getJewelry,getWatches,getBags,getShoes} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// ✨ SAFE FALLBACK ROUTE: Agar aapka dashboard /api/products/admin ko hit karega 
// toh yeh bina crash kiye seedha aapke existing addProduct controller ko run kar dega!
router.post('/admin', protect, addProduct);

// 1. Naya Product add karein (Sirf logged-in users ke liye)
router.post('/add', protect, addProduct);

// 2. Saare products dekhein (Public)
router.get('/', getProducts);

router.get('/bestsellers', getBestSellers);

router.get('/category/electronics', getProductsByCategory);

// Fashion Route
router.get('/category/fashion', getFashionProducts);


// Hot Deals Route
router.get('/category/hotdeals', getHotDeals);

router.get('/category/fragrances', getFragrances);

router.get('/category/jewelry', getJewelry);

// Watches Route
router.get('/category/watches', getWatches);

// Bags Route
router.get('/category/bags', getBags);
// Shoe Category Route
router.get('/category/shoes', getShoes);





// 3. Product delete karein (Logged-in users ke liye)
router.delete('/:id', protect, deleteProduct);

//4. Naya PUT route add karein
router.put('/:id', protect, updateProduct);

// 2.5 Single product detail (Public) - YE LAZMI HAI
router.get('/:id', getProductById);


module.exports = router;