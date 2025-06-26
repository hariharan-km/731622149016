const mongoose = require('mongoose');
const shortUrlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  clicks: [
    {
      timestamp: Date,
      referrer: String,
      location: String,
    },
  ],
});
module.exports = mongoose.model('ShortUrl', shortUrlSchema);