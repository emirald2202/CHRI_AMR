const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// TEMPORARY: Secret route to bypass local network blocking and promote a user
router.get('/make-admin', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.send('Provide an ?email=... query parameter');
    const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { role: 'admin' }, { new: true });
    if (!user) return res.send('User not found.');
    res.send(`Success! ${user.name} (${user.email}) is now an admin!`);
  } catch (error) {
    res.send('Error: ' + error.message);
  }
});

router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);
router.get('/pharmacies', auth, userController.getPharmacies);
router.delete('/me', auth, userController.deleteMe);

module.exports = router;
