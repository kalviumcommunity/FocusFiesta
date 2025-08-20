const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    // Create user
    const user = await new User({
      name,
      email,
      password: passwordHash, // store hashed password!
    });
    await user.save();

    
    const token = generateToken(user._id);

    // Send cookie with proper settings
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/', // Ensure cookie is available across all routes
    });

    // Cookie set successfully during signup

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user; // Passport attaches user here
    
    if (!user) {
      console.error('No user in Google callback');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
    }

    console.log('Google OAuth callback - User:', user.email);

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set the JWT as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
    });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
    });

    // Redirect to frontend dashboard
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`);
  } catch (err) {
    console.error("Google callback error:", err);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }
};

//Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Password comparison logging removed for security

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send cookie with proper settings
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/', // Ensure cookie is available across all routes
    });

    // Cookie set successfully

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// Logout 
exports.logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // This route should be protected by authMiddleware, so req.user should exist
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching profile' });
  }
};
