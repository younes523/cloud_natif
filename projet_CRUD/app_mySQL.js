const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
// const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// app.use(bodyParser.json()); //Méthode ancienne
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'usersDB'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// GET: Retrieve all users
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(result);
  });
});

// GET: Search for a user
app.get('/users/:id', (req, res) => {

  const {id} = req.params;

  const sql = 'SELECT * FROM users where id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error querying MySQL: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if(result.length > 0){
      res.json({found : true});
      return;
    }

    res.json({found : false});
});
});

// POST: Create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';

  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error('Error inserting into MySQL:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json({ message: 'User created', id: result.insertId });
  });
});

// PUT: Update a user by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const response = await axios.get("http://localhost:3000/users/" + id);

  if(response.data.found){
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(sql, [name, email, id], (err, result) => {
      if (err) {
        console.error('Error updating MySQL:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.json({ message: 'User updated' });
    });
  }
  else{
    res.json({message : "user not found"});
  }
  });

// DELETE: Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting from MySQL:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json({ message: 'User deleted' });
  });
});

/*
// PATCH: Partially update a user by ID
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';

  db.query(sql, [name, email, id], (err, result) => {
    if (err) {
      console.error('Error patching in MySQL:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json({ message: 'User partially updated' });
  });
});
*/

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
