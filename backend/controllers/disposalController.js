const DisposalRequest = require('../models/DisposalRequest');
const User = require('../models/User');

// @desc    Create new disposal request
// @route   POST /api/disposals
// @access  Private (User)
exports.createDisposalRequest = async (req, res) => {
  try {
    const { 
      pharmacyId, disposalType, pickupAddress, userMedicines
    } = req.body;

    if (!pharmacyId || !disposalType || !userMedicines || userMedicines.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields and at least one medicine in the package' });
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
      userMedicines,
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
    const { status, verifiedMedicines } = req.body;
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

    // --- STRICT CROSSCHECK AUDIT ALGORITHM ---
    if (status === 'completed' && verifiedMedicines && Array.isArray(verifiedMedicines)) {
        const userMeds = request.userMedicines || [];
        
        if (userMeds.length !== verifiedMedicines.length) {
            return res.status(400).json({ message: `Verification Failed: Discrepancy detected with item inventory.` });
        }

        // Deep verify names and quantities regardless of array order
        for (let i = 0; i < userMeds.length; i++) {
            const expected = userMeds[i];
            const logged = verifiedMedicines.find(m => m.medicineName.toLowerCase() === expected.medicineName.toLowerCase());

            if (!logged || Number(logged.remainingQty) !== Number(expected.remainingQty)) {
                return res.status(400).json({ message: `Verification Failed: Discrepancy detected with item inventory.` });
            }
        }
    }

    request.status = status;
    if (verifiedMedicines && Array.isArray(verifiedMedicines)) {
       request.verifiedMedicines = verifiedMedicines;
    }
    
    // --- DYNAMIC FINANCIAL POINTS ENGINE ---
    if (status === 'completed' && !request.pointsAwarded) {
      // 1. Calculate the raw total remaining MRP sum for the entire verified package securely on the server
      let totalRemainingMRP = 0;
      for (const med of request.verifiedMedicines) {
         totalRemainingMRP += Number(med.remainingMRP) || 0;
      }

      // 2. Calculate the rolling 30-day frequency cap for this exact Citizen
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentDisposals = await DisposalRequest.countDocuments({
         userId: request.userId,
         status: 'completed',
         updatedAt: { $gte: thirtyDaysAgo },
         _id: { $ne: request._id }
      });

      // 3. Apply Tiered Logarithmic Yield Multiplier
      let multiplier = 0;
      if (recentDisposals === 0) multiplier = 0.20;       // 1st of rolling month: 20%
      else if (recentDisposals === 1) multiplier = 0.05;  // 2nd of rolling month: 5%
      else if (recentDisposals === 2) multiplier = 0.01;  // 3rd of rolling month: 1%
      else multiplier = 0;                                // 4th+ of rolling month: 0%

      const pointsToAward = Math.floor(totalRemainingMRP * multiplier);

      // 4. Issue the Financial Yield securely to Citizens and Track Collections for Pharmacies
      const citizen = await User.findById(request.userId);
      if (citizen) {
         citizen.points = (citizen.points || 0) + pointsToAward;
         citizen.totalDisposals += 1;
         await citizen.save();
      }
      
      const pharmacy = await User.findById(request.pharmacyId);
      if (pharmacy) {
        pharmacy.totalCollections += 1;
        await pharmacy.save();
      }

      request.pointsAwarded = true;
      request.awardedPoints = pointsToAward;
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
