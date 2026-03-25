const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Max 5 registrations per hour per IP (A07)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100, // Temporarily increased for testing (was 5)
  message: { message: 'Too many accounts created from this IP. Try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Max 10 login attempts per 15 min per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Max 5 OTP requests per 15 min per IP
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many OTP requests. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', registerLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/send-otp', otpLimiter, authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/forgot-password', otpLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
