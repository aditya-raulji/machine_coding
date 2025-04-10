const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(express.json());

// Sample route to generate a token (for testing)
app.post('/login', (req, res) => {
  // Simulate user login (in real apps, validate credentials)
  const user = { id: 1, username: 'testuser' };
  const token = jwt.sign(user, 'your-secret-key', { expiresIn: '1h' });
  res.json({ token });
});

// Protected route
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You accessed a protected route!', user: req.user });
});

// Public route (no middleware)
app.get('/public', (req, res) => {
  res.json({ message: 'This is a public route' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});










