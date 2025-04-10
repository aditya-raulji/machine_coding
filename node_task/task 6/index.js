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


// PATCH to Partially Update User
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
  
//   1. `app.patch('/users/:id', (req, res) => {`
//      - Yeh ek PATCH request handler hai
//      - URL pattern hai `/users/:id` (jaise `/users/1`)
//      - PATCH method ka use resource ke specific fields ko update karne ke liye hota hai
  
//   2. `const userId = parseInt(req.params.id);`
//      - URL se `:id` parameter nikalta hai
//      - `parseInt()` se string ko number mein convert karta hai
//      - Example: `/users/3` se `userId = 3`
  
//   3. `const user = users.find(u => u.id === userId);`
//      - `users` array mein se matching ID wala user dhundta hai
//      - Agar milta hai to `user` mein object assign hota hai, nahi to `undefined`
  
//   4. `if (user) {`
//      - Check karta hai ki user mila ya nahi
//      - Agar user exist karta hai to update process shuru hota hai
  
//   5. `if (req.body.name !== undefined) { user.name = req.body.name; }`
//      - Check karta hai ki request body mein `name` field aaya hai ya nahi
//      - Agar aaya hai to user ka name update kar deta hai
//      - Agar nahi aaya to name ko chhod deta hai
  
//   6. `if (req.body.email !== undefined) { user.email = req.body.email; }`
//      - Same cheez email ke liye
//      - Sirf wahi field update hota hai jo request mein bheja gaya hai
  
//   7. `res.status(200).json(user);`
//      - Success status (200) ke saath updated user ko JSON mein bhejta hai
  
//   8. `else { res.status(404).json({ message: 'User not found' }); }`
//      - Agar user nahi milta to 404 status ke saath error message bhejta hai
  
//   Example:
//   - Agar `users = [{id: 1, name: "Amit", email: "amit@gmail.com"}]`
//   - Request: PATCH `/users/1` with body `{name: "Rohit"}`
//     - Response: `{"id": 1, "name": "Rohit", "email": "amit@gmail.com"}`
//     - Sirf name update hua, email wahi raha
//   - Request: PATCH `/users/1` with body `{email: "rohit@gmail.com"}`
//     - Response: `{"id": 1, "name": "Rohit", "email": "rohit@gmail.com"}`
//     - Sirf email update hua
//   - Agar `/users/999` (jo exist nahi karta):
//     - Response: `{"message": "User not found"}` with 404 status
  
//   Fark:
//   - PUT se alag yeh hai ki PATCH sirf wahi fields update karta hai jo request mein bheje gaye
//   - PUT pura object replace karta hai, jabki PATCH partially update karta hai



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
