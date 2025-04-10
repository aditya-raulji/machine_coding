
```
project-folder/
├── config/
│   └── config.js        # Configuration (e.g., JWT secret)
├── middleware/
│   ├── auth.js         # JWT authentication middleware
│   └── role.js         # Role-checking middleware
├── routes/
│   └── auth.js         # Authentication routes (login)
│   └── protected.js    # Protected routes (user, admin, etc.)
├── .env                # Environment variables
├── index.js            # Main server file
├── package.json        # Project dependencies
```

---

### Step 1: Set Up the Project
1. Create a new folder: `project-folder`.
2. Initialize the project:
   ```bash
   cd project-folder
   npm init -y
   ```
3. Install dependencies:
   ```bash
   npm install express jsonwebtoken dotenv
   ```
4. Create the folder structure as shown above.

---

### Step 2: Full Code for Each File

#### 1. `.env` (Root Directory)
This file stores environment variables like the JWT secret.
```plaintext
JWT_SECRET=your_super_secret_key_here
PORT=3000
```

#### 2. `config/config.js`
This file centralizes configuration settings.
```javascript
require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
};
```

#### 3. `middleware/auth.js`
This file contains the JWT authentication middleware.
```javascript
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; // Attach decoded payload to request
    next();
  });
};

module.exports = authenticateToken;
```

#### 4. `middleware/role.js`
This file contains the role-checking middleware.
```javascript
const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = checkRole;
```

#### 5. `routes/auth.js`
This file defines the login route to generate JWTs.
```javascript
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
```

#### 6. `routes/protected.js`
This file defines the protected routes with role-based access.
```javascript
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
```

#### 7. `index.js` (Root Directory)
This is the main server file that ties everything together.
```javascript
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
```

#### 8. `package.json` (Root Directory, Auto-Generated with Modifications)
Ensure it includes a start script:
```json
{
  "name": "project-folder",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2"
  }
}
```

---

### Step 3: How to Run the Project
1. Ensure all files are saved in the correct locations as per the structure above.
2. Start the server:
   ```bash
   npm start
   ```
3. The server will run on `http://localhost:3000` (or the port specified in `.env`).

---

### Step 4: Testing the Routes
Use a tool like Postman or curl to test:

1. **Get a Token**:
   - **Request**: `POST http://localhost:3000/auth/login`
   - **Body**: `{"username": "john", "role": "admin"}`
   - **Response**: `{ "token": "<admin-token>" }`
   - Repeat with `{"username": "jane", "role": "user"}` for a user token.

2. **Test Routes**:
   - **Public Route**: `GET http://localhost:3000/public`
     - No token needed.
     - Response: `"This is a public route"`
   - **User Route**: `GET http://localhost:3000/user`
     - Header: `Authorization: Bearer <token>`
     - Works with any valid token.
   - **Admin Route**: `GET http://localhost:3000/admin`
     - Header: `Authorization: Bearer <admin-token>`
     - Fails with user token (`"Insufficient permissions"`).
   - **Mixed Route**: `GET http://localhost:3000/mixed`
     - Header: `Authorization: Bearer <token>`
     - Works with both admin and user tokens.

---

### Explanation of File Placement
- **`.env`**: Root directory for environment variables.
- **`config/config.js`**: Centralizes configuration (e.g., JWT secret, port).
- **`middleware/auth.js`**: JWT verification logic, reusable across routes.
- **`middleware/role.js`**: Role-checking logic, reusable for different role requirements.
- **`routes/auth.js`**: Handles authentication-related endpoints (e.g., login).
- **`routes/protected.js`**: Defines protected routes with role-based restrictions.
- **`index.js`**: Main entry point, sets up the server and mounts routes.
