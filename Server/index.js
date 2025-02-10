const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
const port = 8000;

// เก็บ user
let users = []
let counter = 1

// path = get /users
app.get('/users', (req, res) => {
    res.json(users);
})

// path = POST / user
app.post('/user', (req, res) => {
    let user = req.body;
    user.id = counter
    counter += 1
    users.push(user);
    res.json({
        message: "User created",
        user: user
    });
})

//path = put /user/ : id
app.put('/user/:id', (req, res) => {
    let.id = req.params.id;
    let updateUser = req.body;
    // หา index ของ user ที่ต้องการ update
    let selectedIndex = users.findIndex(user => user.id == id)
    //  update user
    if (updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname
    }

    if (updateUser.lastname) {
        users[selectedIndex].lastname = updateUser.lastname
    }
    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
    users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname

    res.json({
        message: "User updated",
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
      }
    });
})

// path = delete /user/:id
app.delete('/user/:id', (req, res) => {
  let id = req.params.id;
let selectedIndex = users.findIndex(user => user.id == id)

users.splice(selectedIndex, 1)
res.json({
    message: "Delete Completed",
    indexDelete: selectedIndex
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});