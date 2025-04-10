const express = require('express');
const app = express();

// Root Route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


