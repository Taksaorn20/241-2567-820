const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 8000;

// Initialize MySQL connection
let users = [];
let counter = 1;
let conn = null;

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8830
    });
};

app.get('/testdb-new', async (req, res) => {
    try {
        const results = await conn.query('SELECT * FROM users');
        res.json(results[0]);
    } catch (error) {
        console.log('Error fetching users: ', error.message);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
        if (results[0].length == 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(results[0][0]);
    } catch (error) {
        console.error('errorMessage', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: 'something went wrong',
            errorMessage: error.message
        });
    }
});

// Create new user
app.post('/users', async (req, res) => {
    try {
        let user = req.body;
        const results = await conn.query('INSERT INTO users SET ?', [user]);
        res.json({
            message: "User created",
            data: results[0]
        });
    } catch (error) {
        console.error('errorMessage', error.message);
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        });
    }
});

// Update user
app.put('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let updateUser = req.body;
        const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id]);
        res.json({
            message: "User updated",
            data: results[0]
        });
    } catch (error) {
        console.error('errorMessage', error.message);
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        });
    }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let updateUser = req.body;
        const results = await conn.query('DELETE From users WHERE id = ?', id);
        res.json({
            message: "Delete User Completed",
            data: results[0]
        });
    } catch (error) {
        console.error('errorMessage', error.message);
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        });
    }
});

app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on port ${port}`);
});