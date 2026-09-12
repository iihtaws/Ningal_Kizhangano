const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Serve sample static images if any
const samplesDir = path.join(__dirname, 'samples');
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}
app.use('/samples', express.static(samplesDir));

// MongoDB state track
app.locals.isMongoConnected = false;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/potato-meter';

console.log(`[Backend] Attempting MongoDB connection to ${mongoUri}...`);
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 4000
}).then(() => {
  app.locals.isMongoConnected = true;
  console.log('[Backend] MongoDB successfully connected!');
}).catch((err) => {
  app.locals.isMongoConnected = false;
  console.warn(`[Backend] MongoDB connection failed (${err.message}). Defaulting to resilient In-Memory Store!`);
});

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '🥔 Potato-O-Meter Backend API Gateway active',
    health: '/api/health',
    analyze: 'POST /api/analyze',
    history: 'GET /api/history'
  });
});

app.listen(PORT, () => {
  console.log(`[Backend] Express server running on port ${PORT}`);
});
