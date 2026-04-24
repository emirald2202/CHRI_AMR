require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const disposalRoutes = require('./routes/disposalRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["https://chri-amr.vercel.app", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/disposals', disposalRoutes);
app.use('/api/admin', adminRoutes);

const User = require('./models/User');
const bcrypt = require('bcrypt');

connectDB().then(async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await User.create({
        name: 'Super Admin',
        email: 'admin@gmail.com',
        phone: '0000000000',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Default admin@gmail.com account initialized.');
    }
  } catch (err) {
    console.error('Error seeding default admin:', err);
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'AMRit API running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
