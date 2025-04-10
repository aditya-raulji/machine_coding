Let’s create a middleware step-by-step to protect private routes by verifying JWT (JSON Web Token) tokens in a Node.js application. I’ll assume you’re using Express.js, as it’s a common framework for this task. If you’re using something else, let me know, and I’ll adjust accordingly!

### Step-by-Step Solution

#### Step 1: Set Up the Environment
- Ensure you have Node.js installed.
- Create a new project (if not already done):
  ```bash
  mkdir jwt-middleware-example
  cd jwt-middleware-example
  npm init -y
  ```
- Install necessary dependencies:
  ```bash
  npm install express jsonwebtoken
  ```

#### Step 2: Understand the Goal
- The middleware will:
  - Check for a JWT token in the `Authorization` header of incoming requests.
  - Verify the token using a secret key.
  - Allow access to the route if valid, or return an error if invalid/missing.
- We’ll use `req.headers.authorization` to get the token, `jsonwebtoken` for verification, and `next()` to pass control to the next handler.

#### Step 3: Create the Middleware
- Create a file called `middleware/auth.js`.
- Write the middleware function to verify the JWT token.

Here’s the code:

```javascript
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
```

**Explanation:**
- `req.headers.authorization`: Gets the `Authorization` header (expected format: `Bearer <token>`).
- `jwt.verify()`: Verifies the token against a secret key. If valid, it decodes the token.
- `next()`: Passes control to the next function if the token is valid.
- Errors (401 for missing token, 403 for invalid token) are returned if verification fails.

#### Step 4: Set Up the Express Server
- Create a file called `index.js`.
- Set up a basic Express server with a protected route.

Here’s the code:

```javascript
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
```

**Explanation:**
- `/login`: A route to generate a token (for testing purposes).
- `/protected`: A route protected by `authMiddleware`.
- `/public`: An unprotected route for comparison.

#### Step 5: Test the Middleware
1. **Start the server:**
   ```bash
   node index.js
   ```

2. **Test the public route:**
   - Use a tool like Postman or `curl`:
     ```bash
     curl http://localhost:3000/public
     ```
   - Expected output: `{"message": "This is a public route"}`

3. **Get a token:**
   - Send a POST request to `/login`:
     ```bash
     curl -X POST http://localhost:3000/login
     ```
   - Response: `{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}`

4. **Test the protected route without a token:**
   - Request:
     ```bash
     curl http://localhost:3000/protected
     ```
   - Expected output: `{"message": "No token provided or invalid format"}`

5. **Test the protected route with a valid token:**
   - Request (replace `<token>` with the token from `/login`):
     ```bash
     curl -H "Authorization: Bearer <token>" http://localhost:3000/protected
     ```
   - Expected output: `{"message": "You accessed a protected route!", "user": {"id": 1, "username": "testuser", ...}}`

6. **Test with an invalid token:**
   - Use a random string as the token:
     ```bash
     curl -H "Authorization: Bearer invalidtoken" http://localhost:3000/protected
     ```
   - Expected output: `{"message": "Invalid or expired token"}`

#### Step 6: Enhance the Middleware (Optional)
- **Environment Variables:** Store the secret key in a `.env` file using `dotenv`:
  - Install: `npm install dotenv`
  - Create `.env`: `JWT_SECRET=your-secret-key`
  - Update `auth.js`:
    ```javascript
    require('dotenv').config();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ```
- **Role-Based Access:** Add logic to check user roles in the decoded token:
  ```javascript
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  ```

#### Final Notes
- Replace `'your-secret-key'` with a strong, unique secret in production.
- Use HTTPS in production to secure token transmission.
- The token expiration (`expiresIn: '1h'`) can be adjusted as needed.

This completes the middleware to protect private routes using JWT! Let me know if you need clarification or further assistance.