const Product = require('../models/Product');
const User = require('../models/User');

const agentTools = {
  // Product add karne ka function
  addProduct: async ({ name, price, category }) => {
    const product = await Product.create({ name, price, category });
    return `Success: ${name} store mein add ho gaya hai.`;
  },
  // User info check karna
  getUserInfo: async ({ email }) => {
    const user = await User.findOne({ email }).select('-password');
    return user ? `User Details: Name: ${user.name}, Role: ${user.role}` : "User nahi mila.";
  },
  // Product delete karna
  deleteProduct: async ({ name }) => {
    await Product.findOneAndDelete({ name: new RegExp(name, 'i') });
    return `${name} ko list se hata diya gaya hai.`;
  }
};

module.exports = agentTools;