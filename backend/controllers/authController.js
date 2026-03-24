const User = require('../models/User');
const jwt = require('jsonwebtoken');
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.supabaseLogin = async (req, res) => {
  try {
    const { id: supabaseId, email: sbEmail, phone: sbPhone } = req.supabaseUser;
    const { name, role, location, pharmacyName, address, phone: bodyPhone } = req.body;

    const email = sbEmail?.toLowerCase().trim();
    const phone = sbPhone || bodyPhone;

    // A09: Find user by Supabase ID
    let user = await User.findOne({ supabaseId });

    if (!user) {
      // First time login - create user in MongoDB
      user = new User({
        supabaseId,
        email,
        phone,
        name: name || email?.split('@')[0] || phone || 'User',
        role: role || 'user',
        location,
        ...(role === 'pharmacy' ? { pharmacyName, address } : {})
      });
      await user.save();
      console.log(`New user created in MongoDB for Supabase ID: ${supabaseId}`);
    }

    // Generate a backend JWT for existing protected routes
    const token = jwt.sign(
      { userId: user._id, role: user.role, supabaseId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        points: user.points
      }
    });
  } catch (error) {
    console.error('Supabase sync error:', error.message);
    res.status(500).json({ message: 'Error syncing with database' });
  }
};
