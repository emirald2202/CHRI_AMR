const DisposalRequest = require('../models/DisposalRequest');
const User = require('../models/User');

// @desc    Create new disposal request
// @route   POST /api/disposals
// @access  Private (User)
exports.createDisposalRequest = async (req, res) => {
  try {
    const { pharmacyId, medicineName, doseWeight, quantity, reason, disposalType, pickupAddress } = req.body;

    if (!pharmacyId || !medicineName || !doseWeight || !quantity || !disposalType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (disposalType === 'pickup' && !pickupAddress) {
      return res.status(400).json({ message: 'Please provide a pickup address' });
    }

    // Verify pharmacy exists
    const pharmacy = await User.findById(pharmacyId);
    if (!pharmacy || pharmacy.role !== 'pharmacy') {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const request = await DisposalRequest.create({
      userId: req.user.userId,
      pharmacyId,
      medicineName,
      doseWeight,
      quantity,
      reason,
      disposalType,
      pickupAddress: disposalType === 'pickup' ? pickupAddress : undefined,
      status: 'pending'
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating disposal request:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's disposal requests
// @route   GET /api/disposals/user
// @access  Private (User)
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await DisposalRequest.find({ userId: req.user.userId })
      .populate('pharmacyId', 'name pharmacyName address phone')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    console.error('Error getting user requests:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get pharmacy's incoming requests
// @route   GET /api/disposals/pharmacy
// @access  Private (Pharmacy)
exports.getPharmacyRequests = async (req, res) => {
  try {
    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Not authorized as a pharmacy' });
    }

    const requests = await DisposalRequest.find({ pharmacyId: req.user.userId })
      .populate('userId', 'name email phone')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    console.error('Error getting pharmacy requests:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update request status
// @route   PUT /api/disposals/:id/status
// @access  Private (Pharmacy)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await DisposalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Make sure the pharmacy trying to update is the assigned one
    if (request.pharmacyId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    // Validate new status
    const validStatuses = ["pending", "accepted", "pickup_scheduled", "collected", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    request.status = status;
    
    // Auto-award points if completed and not yet awarded
    if (status === 'completed' && !request.pointsAwarded) {
      request.pointsAwarded = true;
      const user = await User.findById(request.userId);
      if (user) {
        user.points += 50; // Award 50 points per completed request
        await user.save();
      }
      
      const pharmacy = await User.findById(request.pharmacyId);
      if (pharmacy) {
        pharmacy.totalCollections += 1;
        pharmacy.participationScore += 10; // Award points to pharmacy too
        await pharmacy.save();
      }
    }

    await request.save();
    
    // return populated updated request
    const updatedRequest = await DisposalRequest.findById(req.params.id)
      .populate('userId', 'name email phone');
      
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating status:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
