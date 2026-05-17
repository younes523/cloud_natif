const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utilisateur = require('./Utilisateur');
const generateToken = require('../shared/utils/generateToken');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_URI = process.env.AUTH_DB_URI || 'mongodb://127.0.0.1:27017/auth-service';

app.use(express.json());

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Auth-Service DB Connected');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

app.post('/auth/register', async (req, res) => {
  ............
});

app.post('/auth/login', async (req, res) => {
 ............
});

app.listen(PORT, () => {
  console.log(`Auth-Service at ${PORT}`);
});
