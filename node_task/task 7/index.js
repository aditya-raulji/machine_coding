const express = require('express');
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  const newUser = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// ✅ PUT: Full update of user
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);

  if (index !== -1) {
    const updatedUser = {
      id: userId,
      name: req.body.name,
      email: req.body.email
    };

    users[index] = updatedUser;
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.patch('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
  
    if (user) {
      // Update only the fields provided in the request body
      if (req.body.name !== undefined) {
        user.name = req.body.name;
      }
  
      if (req.body.email !== undefined) {
        user.email = req.body.email;
      }
  
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
  


  // DELETE a User
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === userId);
  
    if (index !== -1) {
      users.splice(index, 1); // Remove the user from array
      res.sendStatus(204); // No Content
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });

  


// 1. `app.delete('/users/:id', (req, res) => {`
//    - Yeh ek DELETE request handler hai
//    - URL pattern hai `/users/:id` (jaise `/users/1`)
//    - DELETE method ka use resource ko remove karne ke liye hota hai

// 2. `const userId = parseInt(req.params.id);`
//    - URL se `:id` parameter nikalta hai
//    - `parseInt()` se string ko number mein convert karta hai
//    - Example: `/users/4` se `userId = 4`

// 3. `const index = users.findIndex(u => u.id === userId);`
//    - `users` array mein se matching ID wale user ka index (position) dhundta hai
//    - Agar milta hai to index number milta hai (0, 1, 2...), nahi to -1

// 4. `if (index !== -1) {`
//    - Check karta hai ki user mila ya nahi
//    - `index !== -1` matlab user exist karta hai

// 5. `users.splice(index, 1);`
//    - `splice()` method array se user ko remove karta hai
//    - `index` batata hai kahan se delete karna hai
//    - `1` batata hai kitne items delete karne hai
//    - Yeh user ko array se hata deta hai

// 6. `res.sendStatus(204);`
//    - Status code 204 bhejta hai (No Content)
//    - 204 ka matlab operation successful hai lekin koi content return nahi karna
//    - Delete ke case mein aam taur pe body nahi bhejte

// 7. `else { res.status(404).json({ message: 'User not found' }); }`
//    - Agar user nahi milta (index = -1)
//    - 404 status ke saath error message bhejta hai

// Example:
// - Agar `users = [{id: 1, name: "Amit"}, {id: 2, name: "Neha"}]`
// - Request: DELETE `/users/1`
//   - Array ban jata hai: `[{id: 2, name: "Neha"}]`
//   - Response: No body, just 204 status
// - Request: DELETE `/users/999` (jo exist nahi karta)
//   - Response: `{"message": "User not found"}` with 404 status

// Kaam:
// - Yeh code ek specific ID wale user ko array se delete karta hai
// - Agar user milta hai to delete karke success batata hai
// - Agar nahi milta to error deta hai


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
