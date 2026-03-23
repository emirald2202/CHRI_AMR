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

    // Create 20 Geographically Diverse Pune Pharmacies
    const puneLocalities = [
      { name: "Kothrud", lat: 18.5074, lng: 73.8077 },
      { name: "Baner", lat: 18.5590, lng: 73.7868 },
      { name: "Hinjewadi", lat: 18.5913, lng: 73.7389 },
      { name: "Wakad", lat: 18.5987, lng: 73.7688 },
      { name: "Viman Nagar", lat: 18.5679, lng: 73.9143 },
      { name: "Kalyani Nagar", lat: 18.5471, lng: 73.9033 },
      { name: "Koregaon Park", lat: 18.5362, lng: 73.8939 },
      { name: "Shivajinagar", lat: 18.5314, lng: 73.8446 },
      { name: "Deccan Gymkhana", lat: 18.5157, lng: 73.8400 },
      { name: "Camp", lat: 18.5018, lng: 73.8769 },
      { name: "Hadapsar", lat: 18.4967, lng: 73.9417 },
      { name: "Magarpatta", lat: 18.5123, lng: 73.9248 },
      { name: "Kharadi", lat: 18.5515, lng: 73.9348 },
      { name: "Aundh", lat: 18.5580, lng: 73.8075 },
      { name: "Pashan", lat: 18.5372, lng: 73.7915 },
      { name: "Bavdhan", lat: 18.5077, lng: 73.7706 },
      { name: "Pimpri", lat: 18.6272, lng: 73.8016 },
      { name: "Chinchwad", lat: 18.6298, lng: 73.7997 },
      { name: "Katraj", lat: 18.4529, lng: 73.8560 },
      { name: "Swargate", lat: 18.5010, lng: 73.8580 }
    ];

    for (let i = 0; i < 20; i++) {
      const area = puneLocalities[i];
      const email = `pharmacy.${area.name.toLowerCase().replace(' ', '')}@pune.demo.com`;
      const rawPassword = `securePune${i + 1}`;
      const hashedPassword = await bcrypt.hash(rawPassword, salt);

      usersToInsert.push({
        name: `${area.name} Central Pharmacy`,
        email: email,
        phone: `88888${String(i + 1).padStart(5, '0')}`,
        password: hashedPassword,
        role: 'pharmacy',
        pharmacyName: `MedPlus Collector ${area.name}`,
        location: 'Pune',
        address: {
          street: `Shop ${Math.floor(Math.random() * 100) + 1}, Main Road, ${area.name}`,
          city: 'Pune',
          state: 'Maharashtra',
          pincode: `4110${String(i + 1).padStart(2, '0')}`
        },
        coordinates: {
          lat: area.lat,
          lng: area.lng
        },
        availabilityStatus: 'accepting',
        totalCollections: Math.floor(Math.random() * 200) + 10
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
