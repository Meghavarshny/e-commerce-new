const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User (buyer or seller)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'All fields (name, email, password, role) are required' 
      });
    }

    // Validate role
    if (!['buyer', 'seller'].includes(role)) {
      return res.status(400).json({ 
        message: 'Role must be either "buyer" or "seller"' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role 
    });
    
    res.status(201).json({ 
      message: 'Registration successful',
      userId: user._id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists' 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    // Generic error response
    res.status(500).json({ 
      message: 'Registration failed due to server error' 
    });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

// Get User Profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.status(200).json(user);
};

// Update User Profile (buyer or seller)
exports.updateProfile = async (req, res) => {
  const { name, email, address, city, postalCode, country } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { name, email, address, city, postalCode, country },
    { new: true }
  ).select('-password');
  res.status(200).json(user);
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};
