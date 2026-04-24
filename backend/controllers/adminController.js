const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get all regular users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching admins' });
  }
};

// Create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required.' });
    
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists with this email.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone: '0000000000', // Default or arbitrary for admins created manually
      password: hashedPassword,
      role: 'admin'
    });
    
    res.status(201).json({ message: 'Admin created successfully', admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating admin' });
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
