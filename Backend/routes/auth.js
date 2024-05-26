const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Role = require('../models/role');

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send('Email or username already exists');
    }

    const role = await Role.findOne({ role_name: 'user' });
    if (!role) {
      console.error('Default role not found');
      return res.status(400).send('Default role not found');
    }

    const user = new User({ email, username, password, role_id: role._id });
    await user.save();

    res.status(201).send('User created');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).populate('role_id');

    if (!user) {
      console.error('Invalid credentials');
      return res.status(400).send('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.error('Invalid credentials');
      return res.status(400).send('Invalid credentials');
    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const token = jwt.sign({ userId: user._id, role: user.role_id.role_name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.send({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.send('Password reset successful.');
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;