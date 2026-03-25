require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const disposalRoutes = require('./routes/disposalRoutes');

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

connectDB();

app.get('/', (req, res) => {
  res.json({ status: 'AMRit API running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
