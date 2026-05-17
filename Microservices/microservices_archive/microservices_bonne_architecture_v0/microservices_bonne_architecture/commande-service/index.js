const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const url = require('url');
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
  const params = new url.URLSearchParams({ id });
  const requestUrl = `${PRODUIT_SERVICE_URL}/produit/rechercher?${params}`;
  const response = await axios.get(requestUrl);
  return response.data;
}

app.post('/commande/ajouter', isAuthenticated, async (req, res) => {
  try {
    const { id, email_utilisateur } = req.body;

    if (!id || !email_utilisateur) {
      return res.status(400).json({ message: 'id et email_utilisateur sont obligatoires.' });
    }

    const result = await rechercherProduit(id);

    if (!result || !result.exists) {
      return res.status(404).json({ error: 'produit inexistant' });
    }

    const newCommande = new Commande({
      produit: id,
      email_utilisateur,
    });

    const commande = await newCommande.save();
    return res.status(201).json(commande);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
});

app.listen(PORT, () => {
  console.log(`Commande-Service at ${PORT}`);
});
