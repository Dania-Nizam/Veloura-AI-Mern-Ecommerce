const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const products = require("./data/products");

dotenv.config();

// ✅ Connect to MongoDB without old options
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// Import products
const importData = async () => {
  try {
    await Product.deleteMany(); // Delete existing products
    await Product.insertMany(products); // Insert new products
    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Destroy all products
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Command line argument
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}