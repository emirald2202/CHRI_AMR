require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const disposalRoutes = require('./routes/disposalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── A05: Security Headers ──────────────────────────────────────────────────
app.use(helmet());

// ── A05: Restrict CORS to known frontend origins ───────────────────────────
const allowedOrigins = [
  'https://chri-amr.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman in dev)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ── A05: Body size limit (prevent DoS via large payloads) ─────────────────
app.use(express.json({ limit: '10kb' }));

// ── A03: NoSQL Injection Prevention ──────────────────────────────────────
app.use(mongoSanitize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/disposals', disposalRoutes);

// Connect to Database
connectDB();

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'AMRit API running' });
});

// ── A05: Global error handler — never leak stack traces ───────────────────
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
