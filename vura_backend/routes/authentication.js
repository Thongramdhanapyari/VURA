const express = require('express');
const router = express.Router();
const User = require('./user'); // Ensure this points to your user model file
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Normalize username (lowercase and trim)
        const normalizedUsername = username.toLowerCase().trim();
        
        // 2. Check for existing user
        const existingUser = await User.findOne({ username: normalizedUsername });
        if (existingUser) {
            return res.status(400).json({ error: "Username taken" });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create New User Instance
        const newUser = new User({ 
            username: normalizedUsername, 
            password: hashedPassword 
        });
        
        // 5. Save and capture the result
        const savedUser = await newUser.save();

        console.log(`[AUTH] New user created: ${savedUser.username}`);

        // 6. Respond with 'user' wrapper for frontend consistency
        res.status(201).json({
            message: "User created successfully",
            user: { 
                _id: savedUser._id, 
                username: savedUser.username 
            }
        });
    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).json({ error: "Server error during registration" });
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const normalizedUsername = username.toLowerCase().trim();

        // 1. Find user by username
        const foundUser = await User.findOne({ username: normalizedUsername });
        if (!foundUser) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // 2. Compare hashed password
        const isMatch = await bcrypt.compare(password, foundUser.password);
        
        if (isMatch) {
            console.log(`[AUTH] Login success: ${foundUser.username}`);
            const payload = { 
                id: foundUser._id,
                iat: Math.floor(Date.now() / 1000) // Issued At time
            };
            
            // This uses the secret you defined in your .env
            const token = jwt.encode(payload, process.env.JWT_SECRET);
            
            // Send back the 'user' object wrapper so App.jsx doesn't fail
            res.status(200).json({ 
                token: token,
                user: {
                    _id: foundUser._id,
                    username: foundUser.username,
                    role: foundUser.role || "admin"
                }
            });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (err) {
        console.error("[AUTH] Login Error:", err.message);
        res.status(500).json({ error: "System connection error" });
    }
});

module.exports = router;