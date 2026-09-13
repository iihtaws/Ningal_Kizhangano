const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const { seedDatabase } = require('./sync-archive');
const Analysis = require('./models/Analysis');

const app = express();
const PORT = process.env.PORT || 5000;

// Production & Local CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, or mobile requests with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    // Allow vercel preview and production subdomains
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir, { maxAge: '1d' }));

// Serve sample static images if any
const samplesDir = path.join(__dirname, 'samples');
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}
app.use('/samples', express.static(samplesDir, { maxAge: '1d' }));

// MongoDB state track
app.locals.isMongoConnected = false;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/potato-meter';

console.log(`[Backend] Connecting to MongoDB (${mongoUri.replace(/:([^:@]+)@/, ':****@')})...`);
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).then(async () => {
  app.locals.isMongoConnected = true;
  console.log('[Backend] MongoDB successfully connected!');

  // Auto-seed tracked spud images if MongoDB collection is fresh/empty
  try {
    const count = await Analysis.countDocuments();
    if (count === 0) {
      console.log('[Backend] Database empty. Auto-seeding initial tracked spuds...');
      await seedDatabase();
    } else {
      console.log(`[Backend] Database ready with ${count} existing potato records.`);
    }
  } catch (seedErr) {
    console.warn('[Backend] Auto-seed check notice:', seedErr.message);
  }
}).catch((err) => {
  app.locals.isMongoConnected = false;
  console.warn(`[Backend] MongoDB connection notice (${err.message}). Using resilient fallback store!`);
});

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '🥔 Potato-O-Meter Backend API Gateway active',
    health: '/api/health',
    analyze: 'POST /api/analyze',
    history: 'GET /api/history',
    leaderboard: 'GET /api/leaderboard'
  });
});

app.listen(PORT, () => {
  console.log(`[Backend] Express server running on port ${PORT}`);
});
