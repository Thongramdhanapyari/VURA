const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    category: { 
        type: String, 
        required: true,
        trim: true 
    },
    // Adding a default of 0 is better than just required: false.
    // This ensures your (Price - Cost) math always works!
    cost: { 
        type: Number, 
        required: false, 
        default: 0 
    }, 
    price: { 
        type: Number, 
        required: true,
        default: 0
    },
    stock: { 
        type: Number, 
        required: true,
        default: 0
    },
    status: { 
        type: String, 
        default: "available" 
    },
    // This links the product to the specific user who created it
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);