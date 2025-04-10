const express = require('express');
const app = express();



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




// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});












