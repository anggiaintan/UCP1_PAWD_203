const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { tempData } = require('../middlewares/middleware');

// Register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  
  // Check if username already exists
  if (tempData.users.find(user => user.username === username)) {
    return res.render('signup', {
      error: 'Username already exists',
      layout: 'layouts/auth-layout'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate user ID
    const userId = tempData.users.length + 1;
    
    // Save user to temporary array
    tempData.users.push({
      id: userId,
      username,
      password: hashedPassword,
      role
    });

    res.redirect('/login');
  } catch (err) {
    res.status(500).render('signup', {
      error: 'Error creating user',
      layout: 'layouts/auth-layout'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user in temporary array
  const user = tempData.users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).render('login', {
      error: 'Invalid credentials',
      layout: 'layouts/auth-layout'
    });
  }

  try {
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).render('login', {
        error: 'Invalid credentials',
        layout: 'layouts/auth-layout'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).render('login', {
      error: 'Error during login',
      layout: 'layouts/auth-layout'
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;