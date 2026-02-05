const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true, // Removes accidental spaces like "user "
        lowercase: true // Ensures "Admin" and "admin" are treated the same
    },
    password: { 
        type: String, 
        required: true 
    },
    role: {
        type: String, 
        default: 'admin'
    }
}, { 
    timestamps: true,
    autoIndex: true // Tells Mongoose to build indexes when the app starts
});

module.exports = mongoose.model('User', userSchema);