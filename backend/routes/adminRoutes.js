const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const adminCheck = require('../middleware/adminMiddleware');

// Need regular auth token + admin rights
router.use(auth);
router.use(adminCheck);

router.get('/users', adminController.getUsers);
router.get('/pharmacies', adminController.getPharmacies);
router.put('/pharmacies/:id/suspend', adminController.toggleSuspension);
router.delete('/pharmacies/:id', adminController.deleteUser);
router.delete('/users/:id', adminController.deleteUser); // can also delete normal users

module.exports = router;
