import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Customer from '../models/Customer.js';
import OTP from '../models/OTP.js';
import generateToken from '../utils/generateToken.js';
import { sendOTPEmail } from '../services/email.service.js';

// ========================================
// ADMIN AUTH CONTROLLERS
// ========================================

// @desc    Admin Login
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await admin.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, 'admin');

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      data: {
        admin,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// CUSTOMER OTP AUTH CONTROLLERS (EMAIL)
// ========================================

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // ✅ Delete existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase() });  // ← lowercase

    // ✅ Create new OTP
    await OTP.create({
      email: email.toLowerCase(),  // ← lowercase में store करें
      otp,
      expiresAt
    });

    // Send email
    const emailResult = await sendOTPEmail(email, otp);
    
    console.log(`📧 OTP for ${email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      data: {
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
// @desc    Verify OTP and login/register customer
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, name } = req.body;

    console.log('📧 Verify Request:', { email, otp, name });

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase(), 
      otp: otp 
    });

    console.log('📧 OTP Record Found:', otpRecord);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one'
      });
    }

    if (otpRecord.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'OTP already verified'
      });
    }

    // ✅ Find or create customer - Mobile को optional रखें
    let customer = await Customer.findOne({ email: email.toLowerCase() });

    if (!customer) {
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required for new customer'
        });
      }

      // ✅ Create customer without mobile
      customer = await Customer.create({
        name,
        email: email.toLowerCase(),
        isVerified: true
        // mobile को skip करें
      });
    } else {
      customer.isVerified = true;
      if (name) customer.name = name;
      await customer.save();
    }

    otpRecord.isVerified = true;
    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    customer.lastLogin = new Date();
    await customer.save();

    const token = generateToken(customer._id, 'customer');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        customer,
        token
      }
    });
  } catch (error) {
    console.error('❌ Verify OTP Error:', error);
    
    // ✅ Better error handling
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ========================================
// COMMON AUTH CONTROLLERS
// ========================================

// @desc    Logout user (Admin or Customer)
// @route   POST /api/auth/logout
// @access  Public (with token)
export const logout = async (req, res) => {
  try {
    // Clear cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;
    let role = null;

    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
      role = 'admin';
    } else if (decoded.role === 'customer') {
      user = await Customer.findById(decoded.id);
      role = 'customer';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: {
        user,
        role
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Check if user is authenticated
// @route   GET /api/auth/check
// @access  Private
export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;
    let role = null;

    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
      role = 'admin';
    } else if (decoded.role === 'customer') {
      user = await Customer.findById(decoded.id);
      role = 'customer';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Authenticated',
      data: {
        user,
        role,
        isAuthenticated: true
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
};