const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../firebaseAdmin');
const User = require('../models/user');
const router = express.Router();


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization token missing or malformed');
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Token not found after Bearer');
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Internal server error' });
    }

    const decoded = jwt.verify(token, secret);
    console.log('Token decoded successfully:', decoded);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;
  console.log('Register request:', req.body);

  if (!name || !email || !password) {
    console.log('Missing fields in registration');
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      console.log('Email already registered:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, username, email, password: hashedPassword });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
    console.log('User registered successfully. JWT token:', token);

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', req.body);

  if (!email || !password) {
    console.log('Missing fields in login');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Invalid credentials for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
    console.log('Login successful. JWT token:', token);

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Example protected route using the JWT middleware
router.get('/protected', authenticateToken, async (req, res) => {
  console.log('Accessing protected route. User ID from token:', req.user.id);
  
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found on protected route:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Protected data access granted for user:', user.email);
    res.json({ message: 'Protected data access granted', user });
  } catch (err) {
    console.error('Protected Route Error:', err);
    res.status(500).json({ message: 'Server error' });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        firebaseUID: user.firebaseUID,
      },
    });
  } catch (error) {
    console.error('Error verifying Firebase token or processing auth:', error);
    res.status(500).json({ error: 'Internal server error during auth process' });
  }
});



module.exports = router;
