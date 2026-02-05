const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  cost: Number,
  stock: Number,
  status: String
});

const Product = mongoose.model('Product', productSchema);

async function seedDB() {
  try {
    // Use the .env string or the Compass default
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vura_db";
    
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Compass local instance.");

    await Product.deleteMany({}); // Clears old data
    
    const items = [
      { name: "vura laptop", category: "Electronics", price: 1200, cost: 850, stock: 4, status: "Critical" },
      { name: "Vura Audio Pro", category: "Audio", price: 299, cost: 120, stock: 15, status: "Healthy" },
      { name: "Smart Link Hub", category: "Accessories", price: 150, cost: 45, stock: 8, status: "Warning" }
    ];

    await Product.insertMany(items);
    console.log("✅ Success! Refresh MongoDB Compass to see 'vura_db'.");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seedDB();