const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, location, pharmacyName, address, coordinates, openingHours } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name, email, phone, password: hashedPassword, role, location,
      ...(role === 'pharmacy' ? { pharmacyName, address, coordinates, openingHours } : {})
    });
    
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    
    await Otp.findOneAndDelete({ email }); // Clear older OTPs
    await new Otp({ email, otp }).save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`
    });

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP to reset password is: ${otp}. It is valid for 5 minutes.`
    });

    res.json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
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
