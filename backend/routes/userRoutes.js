const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.get('/me', auth, userController.getMe);
router.get('/pharmacies', auth, userController.getPharmacies);

module.exports = router;
