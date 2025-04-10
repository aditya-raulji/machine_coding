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



// 1. `app.put('/users/:id', (req, res) => {`
//    - Yeh ek PUT request handler hai
//    - URL pattern hai `/users/:id` (jaise `/users/1`)
//    - PUT method ka use existing resource ko fully update karne ke liye hota hai

// 2. `const userId = parseInt(req.params.id);`
//    - URL se `:id` parameter nikalta hai
//    - `parseInt()` se string ko number mein convert karta hai
//    - Jaise `/users/5` se `userId = 5`

// 3. `const index = users.findIndex(u => u.id === userId);`
//    - `users` array mein se user ka index (position) dhundta hai
//    - `findIndex()` array mein matching ID wale user ka index return karta hai
//    - Agar nahi milta to -1 return hota hai

// 4. `if (index !== -1) {`
//    - Check karta hai ki user mila ya nahi
//    - `index !== -1` matlab user exist karta hai

// 5. `const updatedUser = { id: userId, name: req.body.name, email: req.body.email };`
//    - Naya user object banata hai
//    - `req.body` se client jo data bhejta hai (name aur email) usko leta hai
//    - ID wahi rakhta hai jo URL se mila

// 6. `users[index] = updatedUser;`
//    - Original array mein us index pe naye updated user se replace karta hai

// 7. `res.status(200).json(updatedUser);`
//    - Success status (200) ke saath updated user ko JSON mein bhejta hai

// 8. `else { res.status(404).json({ message: 'User not found' }); }`
//    - Agar user nahi milta (index = -1)
//    - 404 status ke saath error message bhejta hai

// Example:
// - Agar `users = [{id: 1, name: "Rahul", email: "r@gmail.com"}]`
// - Request: PUT `/users/1` with body `{name: "Ravi", email: "ravi@gmail.com"}`
//   - Response: `{"id": 1, "name": "Ravi", "email": "ravi@gmail.com"}`
//   - Array update ho jayega: `[{id: 1, name: "Ravi", email: "ravi@gmail.com"}]`
// - Agar `/users/999` (jo exist nahi karta):
//   - Response: `{"message": "User not found"}` with 404 status

// Yeh code ek user ko uski ID se find karta hai aur uski puri details (name aur email) ko update karta hai, agar user nahi milta to error deta hai.

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
