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
  try {
    let { nom, email, password } = req.body;

    if (!nom || !email || !password) {
      return res.status(400).json({ message: 'nom, email et password sont obligatoires.' });
    }

    const userExists = await Utilisateur.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'Cet utilisateur existe déjà.' });
    }

    password = await bcrypt.hash(password, 10);

    const newUtilisateur = new Utilisateur({
      nom,
      email,
      password,
    });

    const savedUser = await newUtilisateur.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email et password sont obligatoires.' });
    }

    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const isValidPassword = await bcrypt.compare(password, utilisateur.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = generateToken({
      email: utilisateur.email,
      nom: utilisateur.nom,
    });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message || error });
  }
});

app.listen(PORT, () => {
  console.log(`Auth-Service at ${PORT}`);
});
