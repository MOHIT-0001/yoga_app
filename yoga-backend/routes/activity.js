const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';


router.get('/activity', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('favouriteYoga favouriteMusic previousYogaSessions');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      favouriteYoga: user.favouriteYoga,
      favouriteMusic: user.favouriteMusic,
      previousYogaSessions: user.previousYogaSessions,
    });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
});



router.post('/activity', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const {
      favouriteYoga,
      favouriteMusic,
      previousYogaSessions,
      previousYogaSession // string like "30min"
    } = req.body;

    if (favouriteYoga !== undefined) {
      user.favouriteYoga = favouriteYoga;
    }

    if (favouriteMusic !== undefined) {
      user.favouriteMusic = favouriteMusic;
    }

    // Handle array version
    if (Array.isArray(previousYogaSessions)) {
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }); // e.g., "26 May 2025"

      const incomingObj = previousYogaSessions.find(obj => obj[dateStr]);

      if (incomingObj) {
        const index = user.previousYogaSessions.findIndex(
          session => session.has(dateStr)
        );

        if (index !== -1) {
          user.previousYogaSessions[index].set(dateStr, incomingObj[dateStr]);
        } else {
          user.previousYogaSessions.push(new Map(Object.entries(incomingObj)));
        }
      }
    }

    // Handle shortcut format: { previousYogaSession: "30min" }
    if (typeof previousYogaSession === 'string') {
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }); // e.g., "26 May 2025"

      const index = user.previousYogaSessions.findIndex(
        session => session.has(dateStr)
      );

      if (index !== -1) {
        user.previousYogaSessions[index].set(dateStr, previousYogaSession);
      } else {
        user.previousYogaSessions.push(new Map([[dateStr, previousYogaSession]]));
      }
    }

    await user.save();

    res.json({ message: 'Activity updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
