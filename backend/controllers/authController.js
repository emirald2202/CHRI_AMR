const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


// ── A04: Server-side input validation helpers ─────────────────────────────
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const secLog = (event, details) => console.warn(`[SECURITY] [${new Date().toISOString()}] ${event}`, details);

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, location, pharmacyName, address, coordinates, openingHours } = req.body;

    // A04: Input validation
    if (!name || name.trim().length < 2 || name.trim().length > 60)
      return res.status(400).json({ message: 'Name must be 2–60 characters.' });
    if (!email || !isValidEmail(email))
      return res.status(400).json({ message: 'Invalid email address.' });
    if (!password || password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    if (phone && !/^[0-9]{10}$/.test(phone))
      return res.status(400).json({ message: 'Phone must be a 10-digit number.' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12); // A02: bcrypt rounds 12
    user = new User({
      name: name.trim(), email: email.toLowerCase().trim(), phone, password: hashedPassword, role, location,
      ...(role === 'pharmacy' ? { pharmacyName, address, coordinates, openingHours } : {})
    });
    
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' }); // A05: no error.message leak
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      secLog('LOGIN_FAIL_USER_NOT_FOUND', { email }); // A09
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      secLog('LOGIN_FAIL_WRONG_PASSWORD', { email }); // A09
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' }); // A05
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    
    await Otp.findOneAndDelete({ email });
    await new Otp({ email, otp }).save();

    await resend.emails.send({
      from: 'AMRit <onboarding@resend.dev>',
      to: email,
      subject: 'Your OTP Code - AMRit',
      text: `Your AMRit OTP is: ${otp}. It is valid for 5 minutes.`
    });

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, isLogin } = req.body;
    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
    
    await Otp.findOneAndDelete({ email });

    if (isLogin) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found in system. Please sign up first.' });
      
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ message: 'OTP verified successfully', token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const otp = generateOTP();
    await Otp.findOneAndDelete({ email });
    await new Otp({ email, otp }).save();

    await sendEmail(
      email,
      'Password Reset OTP - AMRit',
      `Your AMRit OTP to reset your password is: ${otp}. It is valid for 5 minutes.`
    );

    res.json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const user = await User.findOne({ email });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    await Otp.findOneAndDelete({ email });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
