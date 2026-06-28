const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    isAdmin: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    role: { 
        type: String, 
        default: 'user',
        enum: ['user', 'admin'] 
    },
    image: { 
        type: String, 
        default: "" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true 
});

// Password ko save karne se pehle encrypt (hash) karna
userSchema.pre('save', async function () { // <--- Yahan se 'next' hata diya
    // Agar password modify nahi hua toh agay barho
    if (!this.isModified('password')) {
        return; // Async function mein return kafi hai
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // next() ki zaroorat nahi agar function async hai aur return ho raha hai
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = mongoose.model('User', userSchema);