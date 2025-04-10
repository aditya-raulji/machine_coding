const jwt = require('jsonwebtoken');

// Middleware function to protect routes
const authMiddleware = (req, res, next) => {
  // Step 3.1: Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  // Step 3.2: Check if the token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or invalid format' });
  }

  // Step 3.3: Extract the token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Step 3.4: Verify the token using the secret key
    const decoded = jwt.verify(token, 'your-secret-key'); // Replace with your secret key
    req.user = decoded; // Attach decoded user info to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    // Step 3.5: Handle invalid token
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;