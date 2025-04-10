const express = require('express');
const app = express();
const { port } = require('./config/config');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

app.use(express.json());

// Mount routes
app.use('/auth', authRoutes);
app.use('/', protectedRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});