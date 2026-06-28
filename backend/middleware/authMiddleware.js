const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            
            // 1. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 2. Debugging: Check karein backend kya read kar raha hai
            console.log("Backend Decoded Token Data:", decoded); 
            console.log("Extracted ID:", decoded.id || decoded._id);

            // 3. Dono possibilities check karein (id ya _id)
            req.user = await User.findById(decoded.id || decoded._id).select("-password");

            if (!req.user) {
                console.log("User not found in Database with this ID");
                return res.status(401).json({ message: "User not found" });
            }

            next(); 
        } catch (error) {
            // Agar yahan 'jwt malformed' aata hai toh matlab secret mismatch hai ya token corrupt hai
            console.error("Token verification failed:", error.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
};

const admin = (req, res, next) => {
    // Check karein ke req.user set hua hai aur wo admin hai
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        console.log("Access Denied: User is not an admin");
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };