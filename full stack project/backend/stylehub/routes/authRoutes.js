import express from 'express';
import {
  adminLogin,
  sendOTP,
  verifyOTP,
  logout,
  getCurrentUser,
  checkAuth
} from '../controllers/authController.js';

const router = express.Router();

// ========================================
// ADMIN ROUTES
// ========================================

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/admin/login', adminLogin);

// ========================================
// CUSTOMER OTP ROUTES
// ========================================

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to customer mobile
 * @access  Public
 */
router.post('/send-otp', sendOTP);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login/register customer
 * @access  Public
 */
router.post('/verify-otp', verifyOTP);

// ========================================
// COMMON ROUTES (Admin + Customer)
// ========================================

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (Admin or Customer)
 * @access  Private
 */
router.post('/logout', logout);  // ✅ ये route होना चाहिए

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', getCurrentUser);

/**
 * @route   GET /api/auth/check
 * @desc    Check if user is authenticated
 * @access  Private
 */
router.get('/check', checkAuth);

export default router;