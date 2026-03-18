const mongoose = require('mongoose');

const disposalRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineName: { type: String, required: true },
  quantity: { type: String, required: true },
  reason: { type: String },
  disposalType: { type: String, enum: ["dropoff", "pickup"], required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "pickup_scheduled", "collected", "completed"], 
    default: "pending" 
  },
  pointsAwarded: { type: Boolean, default: false }
}, {
  timestamps: true // Provides createdAt and updatedAt
});

module.exports = mongoose.model('DisposalRequest', disposalRequestSchema);
