const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);
router.get('/pharmacies', auth, userController.getPharmacies);
router.delete('/me', auth, userController.deleteMe);

module.exports = router;
