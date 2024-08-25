const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());

app.listen(3001);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if(err) {
        console.log(err.message)
    }
    else{
        console.log('connected to database')
    }
})


app.get('/blogs', (req, response) => {
    const query = 'SELECT * FROM blog';
    connection.query(query, (err, result) => {
        if (err) {
            throw err
            console.log(err.message);
        }
        response.json(result);
    })
})

app.get('/blogs/:id', (req, response) => {
    const {id} = req.params;
    const query = 'SELECT * FROM blog WHERE id = ?';
    connection.query(query, [id],(err, result) => {
        if (err) {
            console.log(err.message);
            return err; 
        }
        else {
            response.json(result[0]);
        }
    })
})

app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    connection.query('INSERT INTO posts (title, description, author) VALUES (?, ?, ?)', [title, content], (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ id: results.insertId });
    });
});






