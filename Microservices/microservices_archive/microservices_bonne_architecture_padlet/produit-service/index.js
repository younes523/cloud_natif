const express = require('express');
const mongoose = require('mongoose');
const Produit = require('./Produit');
const verifierPrix = require('./verifierPrix');
const isAuthenticated = require('../shared/middlewares/isAuthenticated');

const app = express();
const PORT = process.env.PORT_PRODUIT || 4001;
const DB_URI = process.env.PRODUIT_DB_URI || 'mongodb://127.0.0.1:27017/produit-service';

app.use(express.json());

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Produit-Service DB Connected');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

app.post('/produit/ajouter', isAuthenticated, verifierPrix, async (req, res) => {
 ......................
});

app.get('/produit/rechercher', async (req, res) => {
 ........................
});

app.listen(PORT, () => {
  console.log(`Produit-Service at ${PORT}`);
});
