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



router.put('/update_activity', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const {
      favouriteYoga,
      favouriteMusic,
      previousYogaSession
    } = req.body;

    // Update favouriteYoga
    // if (favouriteYoga !== undefined) {
    //   user.favouriteYoga = favouriteYoga;
    // }

    // Update favouriteMusic
    // if (favouriteMusic !== undefined) {
    //   user.favouriteMusic = favouriteMusic;
    // }


        // ✅ Append to favouriteYoga array (if not already included)
    if (favouriteYoga !== undefined) {
      if (!Array.isArray(user.favouriteYoga)) {
        user.favouriteYoga = []; // Initialize if undefined
      }
      if (!user.favouriteYoga.includes(favouriteYoga)) {
        user.favouriteYoga.push(favouriteYoga);
      }
    }

    // ✅ Append to favouriteMusic array (if not already included)
    if (favouriteMusic !== undefined) {
      if (!Array.isArray(user.favouriteMusic)) {
        user.favouriteMusic = []; // Initialize if undefined
      }
      if (!user.favouriteMusic.includes(favouriteMusic)) {
        user.favouriteMusic.push(favouriteMusic);
      }
    }

    // Update or insert today's yoga session with full time addition
    if (typeof previousYogaSession === 'string') {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const newTime = parseDuration(previousYogaSession);
      if (!newTime) return res.status(400).json({ error: 'Invalid time format' });

      const session = user.previousYogaSessions.find(s => s.date === today);

      let finalTime = newTime;
      if (session) {
        const existingTime = parseDuration(session.duration);
        finalTime = addDurations(existingTime, newTime);
        session.duration = formatDuration(finalTime);
      } else {
        user.previousYogaSessions.push({ date: today, duration: formatDuration(finalTime) });
      }
    }

    await user.save();
    res.json({ message: 'Activity updated successfully', user });

  } catch (err) {
    console.error('JWT Verification or DB Error:', err);

    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid or malformed token' });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

// 🔧 Parses strings like "1hr 5min 10sec" into an object {hr, min, sec}
function parseDuration(str) {
  const hrMatch = str.match(/(\d+)\s*hr/i);
  const minMatch = str.match(/(\d+)\s*min/i);
  const secMatch = str.match(/(\d+)\s*sec/i);

  if (!hrMatch && !minMatch && !secMatch) return null;

  return {
    hr: hrMatch ? parseInt(hrMatch[1]) : 0,
    min: minMatch ? parseInt(minMatch[1]) : 0,
    sec: secMatch ? parseInt(secMatch[1]) : 0
  };
}

// 🧮 Adds two duration objects together
function addDurations(d1, d2) {
  let totalSec = d1.sec + d2.sec;
  let totalMin = d1.min + d2.min + Math.floor(totalSec / 60);
  totalSec = totalSec % 60;

  let totalHr = d1.hr + d2.hr + Math.floor(totalMin / 60);
  totalMin = totalMin % 60;

  return { hr: totalHr, min: totalMin, sec: totalSec };
}

// 🧾 Converts {hr, min, sec} => "1hr 20min 4sec"
function formatDuration({ hr, min, sec }) {
  const parts = [];
  if (hr > 0) parts.push(`${hr}hr`);
  if (min > 0) parts.push(`${min}min`);
  if (sec > 0) parts.push(`${sec}sec`);
  return parts.join(' ') || '0sec';
}



router.delete('/activity_delete', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { deleteFavouriteYoga, deleteFavouriteMusic } = req.body;

    // Check which field to remove
    if (deleteFavouriteYoga) {
      user.favouriteYoga = user.favouriteYoga.filter(id => id.toString() !== deleteFavouriteYoga);
    }

    if (deleteFavouriteMusic) {
      user.favouriteMusic = user.favouriteMusic.filter(id => id.toString() !== deleteFavouriteMusic);
    }

    if (!deleteFavouriteYoga && !deleteFavouriteMusic) {
      return res.status(400).json({ error: 'No valid deletion field provided' });
    }

    await user.save();
    res.json({ message: 'Favourite item deleted successfully', user });

  } catch (err) {
    console.error('Error in deleting favourite:', err);

    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid or malformed token' });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
