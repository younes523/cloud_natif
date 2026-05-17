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
  try {
    const { nom, description, prix } = req.body;

    const newProduit = new Produit({
      nom,
      description,
      prix,
    });

    const produit = await newProduit.save();
    return res.status(201).json(produit);
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
});

app.get('/produit/rechercher', async (req, res) => {
  try {
    const { id } = req.query;
    const produit = await Produit.findById(id);

    return res.status(200).json({
      exists: !!produit,
      produit: produit || null,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || error });
  }
});

app.listen(PORT, () => {
  console.log(`Produit-Service at ${PORT}`);
});
