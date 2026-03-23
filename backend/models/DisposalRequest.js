const mongoose = require('mongoose');

const medicineItemSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  genericName: { type: String },
  medicineType: { type: String },
  doseWeight: { type: String },
  manufacturer: { type: String },
  isAntibiotic: { type: Boolean, default: false },
  remainingQty: { type: Number },
  totalQty: { type: Number },
  remainingPercent: { type: Number },
  fullMRP: { type: Number },
  remainingMRP: { type: Number },
  reason: { type: String },
  quantity: { type: String }, // Legacy string fallback
});

const disposalRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Array of medicines claimed by the user dropping them off
  userMedicines: [medicineItemSchema],

  // Array of medicines physically documented by the Pharmacy upon collection
  verifiedMedicines: [medicineItemSchema],

  reason: { type: String },
  disposalType: { type: String, enum: ["dropoff", "pickup"], required: true },
  pickupAddress: { type: String },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "pickup_scheduled", "collected", "completed"], 
    default: "pending" 
  },
  pointsAwarded: { type: Boolean, default: false },
  awardedPoints: { type: Number, default: 0 }
}, {
  timestamps: true // Provides createdAt and updatedAt
});

module.exports = mongoose.model('DisposalRequest', disposalRequestSchema);
