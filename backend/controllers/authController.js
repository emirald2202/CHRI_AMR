const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const https = require('https');

// Brevo REST API over HTTPS (port 443) — bypasses ALL SMTP blocks on cloud servers
const sendEmail = (to, subject, text) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      sender: { name: 'AMRit', email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      textContent: text
    });

    const req = https.request({
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
        else reject(new Error(`Brevo error ${res.statusCode}: ${data}`));
      });
    });

    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Email timed out')); });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
};

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

    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
      return res.status(500).json({ message: 'Email not configured: Missing BREVO_API_KEY or BREVO_SENDER_EMAIL in Render.' });
    }

    const otp = generateOTP();
    await Otp.findOneAndDelete({ email });
    await new Otp({ email, otp }).save();

    await sendEmail(email, 'Your OTP Code - AMRit', `Your AMRit OTP is: ${otp}. It is valid for 5 minutes.`);

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('sendOtp error:', error.message);
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
