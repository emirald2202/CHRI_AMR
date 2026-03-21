const express = require('express');
const router = express.Router();
const { 
  createDisposalRequest, 
  getUserRequests, 
  getPharmacyRequests, 
  updateRequestStatus 
} = require('../controllers/disposalController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createDisposalRequest);
router.get('/user', protect, getUserRequests);
router.get('/pharmacy', protect, getPharmacyRequests);
router.put('/:id/status', protect, updateRequestStatus);

module.exports = router;
