const express = require('express');
const router = express.Router();
const ShortUrl = require('../models/ShortUrl');
const { nanoid } = require('nanoid');

router.post('/shorten', async (req, res) => {
  const { originalUrl, customCode, validity } = req.body;
  const code = customCode || nanoid(6);
  const expiresAt = new Date(Date.now() + (validity || 30) * 60000);
  try {
    const exists = await ShortUrl.findOne({ shortCode: code });
    if (exists) return res.status(400).json({ error: 'Code already exists' });
    const newUrl = await ShortUrl.create({ originalUrl, shortCode: code, expiresAt });
    res.json({ shortLink: `http://localhost:5000/${code}`, expiry: expiresAt });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const url = await ShortUrl.findOne({ shortCode: req.params.code });
    if (!url || url.expiresAt < new Date()) return res.status(404).json({ error: 'Link not found or expired' });
    url.clicks.push({ timestamp: new Date(), referrer: req.headers.referer || 'direct', location: 'India' });
    await url.save();
    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Redirect error' });
  }
});

router.get('/shorturls/:code', async (req, res) => {
  try {
    const url = await ShortUrl.findOne({ shortCode: req.params.code });
    if (!url) return res.status(404).json({ error: 'Short URL not found' });
    res.json({
      totalClicks: url.clicks.length,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      clicks: url.clicks,
    });
  } catch (err) {
    res.status(500).json({ error: 'Stats fetch error' });
  }
});

module.exports = router;