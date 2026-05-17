const express = require("express");
const app = express();
//const PORT = process.env.PORT_ONE || 4001;
const PORT = 4002;
const mongoose = require("mongoose");
const Commande = require("./Commande");
const axios = require('axios');

const url = require('url');

app.use(express.json());

// Enable CORS for all routes

//Connexion à la base de données

/********************************************************************************/

mongoose.connect("mongodb://127.0.0.1:27017/commande-service")
    .then(() => {
        console.log(`Commande-Service DB Connected`);
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

/********************************************************************************/

async function rechercherProduit(id) {
    try {
       let payload = {id};
       const params = new url.URLSearchParams(payload);
        const URL = `http://localhost:4001/produit/rechercher?${params}`
        const response = await axios.get(URL);
        return response.data;

    } catch (error) {
        console.error(error);
    }
}

/********************************************************************************/

app.post("/commande/ajouter", async (req, res, next) => {
    // Création d'une nouvelle commande dans la collection commande
    const { id, email_utilisateur } = req.body;

    rechercherProduit(id).then(result => {

        if(result){
        const newCommande = new Commande({
            produit:id,
            email_utilisateur: email_utilisateur,

        });
        newCommande.save()
            .then(commande => res.status(201).json(commande))
            .catch(error => res.status(400).json({ error }));
    }
    else{
        res.status(201).json({error : "produit inexistant"});
    }}
);
});

/********************************************************************************/

app.listen(PORT, () => {
    console.log(`Commande-Service at ${PORT}`);
});