const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/product');
const authRoutes = require('./routes/authentication');
const jwt = require('jwt-simple');
require('dotenv').config();

const app = express();
// --- DATABASE CONNECTION ---
const mongoURI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use('/api/authentication', authRoutes);


if (!JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is not defined in .env. Auth might fail.");
}

if (!mongoURI) {
  console.error("❌ ERROR: MONGODB_URI is not defined in .env file.");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ Database Connection Error:", err));

// --- 1. GET PRODUCTS BY USER ---
app.get('/api/products/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === 'undefined' || userId === 'null' || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json([]); 
    }
    const products = await Product.find({ user: userId }).sort({ createdAt: -1 });
    res.json(products || []); 
  } catch (err) {
    console.error("🔥 GET Error:", err);
    res.status(200).json([]); 
  }
});

// --- 2. POST NEW PRODUCT ---
app.post('/api/products', async (req, res) => {
  try {
    const { user, name, category, price, stock, cost, status } = req.body;
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ error: "Invalid User ID owner." });
    }
    const newProduct = new Product({
      user,
      name,
      category,
      price: Number(price || 0),
      stock: Number(stock || 0),
      cost: Number(cost || 0), 
      status: status || "available"
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("🔥 POST Error:", err.message);
    res.status(400).json({ error: err.message }); 
  }
});

// --- 3. DELETE PRODUCT ---
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }
    const result = await Product.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("🔥 DELETE Error:", err);
    res.status(500).json({ error: "Deletion failed on server" });
  }
});

// --- 4. UPDATE PRODUCT ---
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }
    const updateData = { ...req.body };
    delete updateData.user; 
    
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);
    if (updateData.cost !== undefined) updateData.cost = Number(updateData.cost);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    console.error("🔥 UPDATE Error:", err);
    res.status(400).json({ error: "Update failed." });
  }
});

// --- 5. SINGLE PRODUCT AI (For DetailDrawer) ---
app.post('/api/ai/analyze', (req, res) => {
  try {
    const { name, price, cost, stock } = req.body;
    const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
    
    let advice = "";
    if (margin < 15) advice = `Your margin on ${name} is quite thin. Consider increasing the price to protect your profits.`;
    else if (stock < 5) advice = `${name} is almost gone! You should restock before you lose sales momentum.`;
    else advice = `${name} is performing well. The current strategy looks solid!`;

    setTimeout(() => res.json({ suggestion: advice }), 500);
  } catch (err) {
    res.status(500).json({ error: "AI analysis failed" });
  }
});

// --- 6. GLOBAL PROJECT AI ANALYTICS (For "Scan Project" Button) ---
app.post('/api/ai/report', (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || products.length === 0) {
      return res.json({ suggestion: "Your inventory is looking a bit empty! Add some assets so I can start analyzing your project happenings." });
    }

    const totalValue = products.reduce((acc, p) => acc + (Number(p.price || 0) * Number(p.stock || 0)), 0);
    const lowStockItems = products.filter(p => Number(p.stock) < 10);
    const categories = [...new Set(products.map(p => p.category))];
    
    const topPerformer = [...products].sort((a, b) => 
      (Number(b.price || 0) - Number(b.cost || 0)) - (Number(a.price || 0) - Number(a.cost || 0))
    )[0];

    let response = ""; 
    if (lowStockItems.length > 0) {
      response = `I've scanned the project. We have ${lowStockItems.length} items running low on stock—specifically ${lowStockItems[0].name}. You might want to restock soon. Your current portfolio value is $${totalValue.toLocaleString()}.`;
    } else if (totalValue > 1000) {
      response = `Things are looking great! Your total project value has hit $${totalValue.toLocaleString()} across ${categories.length} categories. ${topPerformer.name} is your strongest asset right now.`;
    } else {
      response = `Everything seems balanced and under control. I'm monitoring all ${products.length} assets for you. No major risks detected!`;
    }

    setTimeout(() => {
      res.json({ suggestion: response });
    }, 600);

  } catch (err) {
    console.error("🔥 AI Report Error:", err);
    res.status(500).json({ suggestion: "I'm having a hard time seeing the project data right now." });
  }
});

// --- FINAL SAFETY NET ---
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0' , () => console.log(`🚀 Server running on port ${PORT}`));