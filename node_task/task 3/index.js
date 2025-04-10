const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON

// In-memory users array
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

// Root Route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// GET All Users
app.get('/users', (req, res) => {
  res.json(users);
});

// POST New User
app.post('/users', (req, res) => {
  const newUser = req.body;
  
  // Optional: Generate ID based on array length
  newUser.id = users.length + 1;

  users.push(newUser); // Add to array
  res.status(201).json(newUser); // Respond with the new user
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
