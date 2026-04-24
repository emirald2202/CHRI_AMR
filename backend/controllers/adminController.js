const User = require('../models/User');

// Get all regular users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get all pharmacies
exports.getPharmacies = async (req, res) => {
  try {
    const pharmacies = await User.find({ role: 'pharmacy' }).select('-password');
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching pharmacies' });
  }
};

// Suspend/Unsuspend a pharmacy
exports.toggleSuspension = async (req, res) => {
  try {
    const { id } = req.params;
    const { suspend } = req.body; // boolean

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User/Pharmacy not found' });
    }

    user.accountStatus = suspend ? 'suspended' : 'active';
    await user.save();

    res.json({ message: `Account successfully ${suspend ? 'suspended' : 'activated'}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error processing suspension' });
  }
};

// Permanently delete a pharmacy/user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User/Pharmacy not found' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'Account successfully removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error removing account' });
  }
};
