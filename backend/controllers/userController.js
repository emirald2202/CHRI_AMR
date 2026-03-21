const User = require('../models/User');

exports.getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPharmacies = async (req, res) => {
  try {
    const pharmacies = await User.find({ role: 'pharmacy' })
      .select('name pharmacyName address phone email coordinates availabilityStatus averageRating')
      .sort('-createdAt');
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
