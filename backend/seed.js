require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const dns = require('dns');

const seedDB = async () => {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Optionally clear existing demo users
    await User.deleteMany({ name: /^Demo User / });
    console.log('Cleared existing Demo Users.');

    const salt = await bcrypt.genSalt(10);
    const usersToInsert = [];

    // Create 50 Demo Users
    for (let i = 1; i <= 50; i++) {
        // Unique email for each user
        const email = `demouser${i}@pune.demo.com`;
        // Unique password (e.g. securePune1, securePune2)
        const rawPassword = `securePune${i}`;
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        // Random stats to optionally match leaderboard
        const points = Math.floor(Math.random() * 350) + 10;
        
        usersToInsert.push({
            name: `Demo User ${i}`,
            email: email,
            phone: `98765${String(i).padStart(5, '0')}`,
            password: hashedPassword,
            role: 'user',
            location: 'Pune', // Locked to Pune
            points: points,
            badges: points > 50 ? ['AMR Defender'] : []
        });
    }

    await User.insertMany(usersToInsert);
    console.log('Successfully seeded 50 Demo Users in Pune!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
