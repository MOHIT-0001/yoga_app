const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = 'your_secret';
const JWT_REFRESH_SECRET = 'your_refresh_secret';

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // hash the password
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
punia
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30s' });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '45s' });

    // Decode tokens to get expiration times
    const accessTokenExp = jwt.decode(accessToken).exp * 1000; // Convert to ms
    const refreshTokenExp = jwt.decode(refreshToken).exp * 1000;

    res.json({
      accessToken,
      accessTokenExp,
      refreshToken,
      refreshTokenExp,
      user: { name: user.name, email: user.email }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/refresh', (req, res) => {
  const { token } = req.body;
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);

    const expiresIn = 30; // in seconds
    const accessToken = jwt.sign({ id: payload.id }, JWT_SECRET, { expiresIn });

    const accessTokenExp = Date.now() + expiresIn * 1000; // timestamp in milliseconds

    res.json({ accessToken, accessTokenExp });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});


module.exports = router;