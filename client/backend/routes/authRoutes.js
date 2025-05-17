const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../firebaseAdmin');
const User = require('../models/user');
const router = express.Router();


router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, username, email, password: hashedPassword });

    await user.save();
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});


router.post('/auth', async (req, res) => {
  const { idToken, isSignUp } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUID = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name || 'Unknown';

    let user = await User.findOne({ firebaseUID });

    if (isSignUp) {
      if (user) {
        return res.status(400).json({ error: 'User already exists, please log in instead' });
      }
      user = new User({ firebaseUID, email, name });
      await user.save();
    } else {
      if (!user) {
        console.log('No user found. Please sign up first.');
        return res.status(404).json({ error: 'No user found. Please sign up first.' });
      }
    }
  } catch (error) {
    console.error('Error verifying Firebase token or processing auth:', error);
    res.status(500).json({ error: 'Internal server error during auth process' });
  }
});



module.exports = router;
