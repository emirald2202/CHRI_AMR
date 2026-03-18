const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "pharmacy"], default: "user" },
  location: { type: String }, // city name
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  
  // Pharmacy specific fields
  pharmacyName: { type: String },
  address: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  openingHours: { type: String },
  availabilityStatus: { 
    type: String, 
    enum: ["accepting", "unavailable", "closed"],
    default: "accepting"
  },
  participationScore: { type: Number, default: 0 },
  totalCollections: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);
