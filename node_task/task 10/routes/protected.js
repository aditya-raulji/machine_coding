const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.get('/public', (req, res) => {
  res.send('This is a public route');
});

router.get('/user', authenticateToken, (req, res) => {
  res.send(`Hello, ${req.user.username}! This is a protected route for all users.`);
});

router.get('/admin', authenticateToken, checkRole(['admin']), (req, res) => {
  res.send(`Hello, ${req.user.username}! This is an admin-only route.`);
});

router.get('/mixed', authenticateToken, checkRole(['admin', 'user']), (req, res) => {
  res.send(`Hello, ${req.user.username}! This is accessible to both admins and users.`);
});

module.exports = router;