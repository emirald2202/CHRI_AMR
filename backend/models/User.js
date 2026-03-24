const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // Optional for phone users
  phone: { type: String, unique: true, sparse: true }, // Unique for phone login
  password: { type: String, required: false }, // Optional for Supabase users
  supabaseId: { type: String, unique: true, sparse: true }, // For Supabase linking
  role: { type: String, enum: ["user", "pharmacy"], default: "user" },
  location: { type: String }, // city name
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  
  // Pharmacy specific fields
  pharmacyName: { type: String },
  address: { 
    flatNo: { type: String },
    street: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
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
