const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(bodyparser.json())

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

app.post('/blogs/create', (req, res) => {
    const { title, description } = req.body;
    console.log(title, description);
    const query = 'INSERT INTO blog (title, description) VALUES (?, ?)'
    connection.query(query, [title, description], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        console.log(results);
        res.status(201).json({ id: results.insertId });
    });
});






