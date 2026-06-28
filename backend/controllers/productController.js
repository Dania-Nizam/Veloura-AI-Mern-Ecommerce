const Product = require('../models/Product');



// 1. Naya Product add karne ke liye
exports.addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: "Product Added ✅", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Saare Products dekhne ke liye
exports.getProducts = async (req, res) => {
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: "i", // 'i' means case-insensitive
    },
  } : {};

  const products = await Product.find({ ...keyword });
  res.status(200).json(products);
};

// 3. Product delete karne ke liye
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product Deleted Successfully 🗑️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Product Update karne ke liye
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ 
            message: "Product Updated Successfully 🔄", 
            product 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Single Product find karne ke liye (Ye missing tha)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Invalid Product ID" });
    }
};

// Get Best Selling Products
exports.getBestSellers = async (req, res) => {
    try {
        // Sirf woh products nikalna jo criteria match karein
        const products = await Product.find({ price: { $gt: 100 } }).limit(4); 
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Products by Category
exports.getProductsByCategory = async (req, res) => {
    try {
        // Database mein 'category' field ko match karna
        const products = await Product.find({ category: 'Electronics' });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Fashion Products
exports.getFashionProducts = async (req, res) => {
    try {
        // Database mein sirf 'Fashion' category filter karein
        const products = await Product.find({ category: 'Fashion' });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Hot Deals (Low Stock Products)
exports.getHotDeals = async (req, res) => {
    try {
        // $lt (less than) 10 aur $gt (greater than) 0 ka filter
        const products = await Product.find({ 
            stock: { $lt: 10, $gt: 0 } 
        }).limit(8); 
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get Fragrance Products
exports.getFragrances = async (req, res) => {
    try {
        // Database mein "Fragrances" (F capital) hai
        const products = await Product.find({ category: "Fragrances" });
        
        if (products.length === 0) {
            return res.status(404).json({ message: "No Fragrances found" });
        }
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Women Jewelry Products
exports.getJewelry = async (req, res) => {
    try {
        // Database mein 'Jewelry' category search karein
        const products = await Product.find({ category: 'Jewelry' });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Watches Products
exports.getWatches = async (req, res) => {
    try {
        // Database mein 'Watches' category dhoondein
        const products = await Product.find({ category: 'Watches' });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Bags Products
exports.getBags = async (req, res) => {
    try {
        const products = await Product.find({ category: { $regex: /^bags$/i } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Shoe Products
exports.getShoes = async (req, res) => {
    try {
        // Database mein 'Shoes' category search karein (Case-sensitive check)
        const products = await Product.find({ category: 'Shoes' });
        
        if (products.length === 0) {
            return res.status(404).json({ message: "No Shoes found in database" });
        }
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};