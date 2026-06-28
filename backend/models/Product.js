const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String }, // Abhi ke liye hum simple link use karenge
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);