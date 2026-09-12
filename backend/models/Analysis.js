const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  ratingTitle: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: 'SPUD'
  },
  description: {
    type: String,
    default: ''
  },
  engine: {
    type: String,
    default: 'CLIP Model'
  },
  breakdown: {
    earthiness: Number,
    texture_match: Number,
    starch_index: Number,
    roundness_factor: Number
  },
  topMatches: [
    {
      label: String,
      confidence: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
