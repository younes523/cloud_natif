const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Commande = require('./Commande');
const isAuthenticated = require('../shared/middlewares/isAuthenticated');

const app = express();
const PORT = process.env.PORT || 4002;
const DB_URI = process.env.COMMANDE_DB_URI || 'mongodb://127.0.0.1:27017/commande-service';
const PRODUIT_SERVICE_URL = process.env.PRODUIT_SERVICE_URL || 'http://localhost:4001';

app.use(express.json());

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Commande-Service DB Connected');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

async function rechercherProduit(id) {
 
}

app.post('/commande/ajouter', isAuthenticated, async (req, res) => {
  ............
    const result = await rechercherProduit(id);

    if (!result || !result.exists) {
      return res.status(404).json({ error: 'produit inexistant' });
    }
...................
});

app.listen(PORT, () => {
  console.log(`Commande-Service at ${PORT}`);
});
