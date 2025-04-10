const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

router.post('/login', (req, res) => {
  const { username, role } = req.body;
  if (!username || !role) {
    return res.status(400).json({ message: 'Username and role are required' });
  }

  const payload = { username, role };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;