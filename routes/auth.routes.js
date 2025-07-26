const express = require('express');
const router = express.Router();
const User = require('../models/Signin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    res.json({ msg: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Error in registration' });
  }
});

// Example: /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debug logs
    console.log("Login Request:", email, password);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { name: user.name, email: user.email } });

  } catch (err) {
    console.error("Login Error:", err);  // 👈 See exact error
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


module.exports = router;
