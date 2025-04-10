const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Dummy user data (replace with DB in real app)
const users = [
  {
    id: 1,
    email: 'test@example.com',
    password: bcrypt.hashSync('123456', 10) // hashed password
  }
];

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email);
  
  if (!user) 
    return res.status(400).json({ message: 'Invalid email or password' });

  // Check password
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

  // Create JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// Start server
app.listen(PORT, () =>
     console.log(`Server running on port ${PORT}`)
);
