const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// 1. GET ALL USERS (Ye naya function hai jo missing tha)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}); // MongoDB se saare users layega
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, image });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin || user.role === 'admin',
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN (Fixed Logic)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Yahan check karein user hai ya nahi, warna compare error dega
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin || user.role === 'admin',
        token: generateToken(user._id),
      });
    } else {
      // Agar password ghalat hai ya user nahi mila
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.image) user.image = req.body.image;
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      isAdmin: updatedUser.role === 'admin',
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error('--- ERROR IN UPDATE PROFILE ---', error); 
    res.status(500).json({ message: error.message });
  }
};

// Controller mein end par ye add karein
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Check karein ke kahin admin khud ko to delete nahi kar raha?
      if (user.isAdmin || user.role === 'admin') {
        res.status(400);
        throw new Error('Admin user cannot be deleted');
      }

      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};