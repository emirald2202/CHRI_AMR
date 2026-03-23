const User = require('../models/User');
const DisposalRequest = require('../models/DisposalRequest');

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

exports.deleteMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    await DisposalRequest.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name)     user.name     = name.trim();
    if (phone)    user.phone    = phone.trim();
    if (location) user.location = location.trim();

    await user.save();
    const updated = await User.findById(req.user.userId).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
