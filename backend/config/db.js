const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // Explicitly configure Node to use Google DNS. 
    // This bypasses ISP-level blocks causing 'querySrv ECONNREFUSED' errors on Atlas connection strings.
    dns.setServers(['8.8.8.8', '8.8.4.4']);

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
