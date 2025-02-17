const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

app.use(bodyParser.json());
const port = 8000;

// เก็บ user
let users = []
let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'root',
        database : 'webdb',
        port : 8830
    });
}

app.get('/testdb-new', async (req, res) => {
    try {
         const results = await conn.query('SELECT * FROM users')
         res.json(results[0])
        } catch (error) {
        console.log('Error fetching users: ', error.message);
        res.status(500).json({error: 'Error fetching users'});
    }
})

// path = get /users สำหรับ get users ทั้งหมด
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0]);
})

// path = POST / users สำหรับ create user ใหม่ บันทึกเข้าไป
app.post('/users', async (req, res) => {
    let user = req.body;
    const results = await conn.query('INSERT INTO users SET ?', users)
    console.log('results', results)
    res.json({
            message: "User created",
            data: results[0]
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

app.listen(port, async (req, res) => {
    await initMySQL();
    console.log(`Server is running on port` + port);
});