const express = require("express");
const app = express();
//const PORT = process.env.PORT_ONE || 4002;
const PORT = 4001;
//Mongoose => an Object Data Modeling (ODM) library for MongoDB and Node.js.
const mongoose = require("mongoose");
const Utilisateur = require("./Utilisateur");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
mongoose.connect("mongodb://127.0.0.1:27017/auth-service")
    .then(() => {
        console.log(`Auth-Service DB Connected`);
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });
app.use(express.json());
// la méthode register permettera de créer et d'ajouter un nouvel utilisateur à la base de données
app.post("/auth/register", async (req, res) => {
    let { nom, email, mot_passe } = req.body;
    //On vérifie si le nouvel utilisateur est déjà inscrit avec la même adresse email ou pas
    const userExists = await Utilisateur.findOne({
        email
    });
    if (userExists) {
        return res.json({ message: "Cet utilisateur existe déjà" });
    } else {//This number 10 determines the number of iterations or work factor used by the hashing algorithm. Increasing this value makes the hash more computationally expensive to compute, thereby making brute-force attacks less feasible.
        //bcrypt.hash(mot_passe, 10, (err, hash) => {
        bcrypt.hash(mot_passe, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err,
                });
            } else {
                mot_passe = hash;
                const newUtilisateur = new
                    Utilisateur({
                        nom,
                        email,
                        mot_passe
                    });
                newUtilisateur.save()
                    .then(user =>
                        res.status(201).json(user))
                    .catch(error =>
                        res.status(400).json({ error }));
            }
        });
    }
});
//la méthode login permettra de retourner un token  après vérification de l'email et du mot de passe
app.post("/auth/login", async (req, res) => {
    const { email, mot_passe } = req.body;
    console.log(email);
    const utilisateur = await Utilisateur.findOne({
        email
    });
    if (!utilisateur) {
        return res.json({
            message: "Utilisateur introuvable"
        });
    } else {
        bcrypt.compare(mot_passe,utilisateur.mot_passe)
            .then(result => {
                if (!result) {
                    return res.json({
                        message: "Mot de passe incorrect"
                    });
                }
                else {
                    const payload = {
                        email,
                        nom: utilisateur.nom
                    };
                    jwt.sign(payload, "SECRET_KEY_3", (err,token) => {
                        if (err) 
                            console.log(err);
                        else return res.json({
                            token: token
                        });
                    });
                }
            });
    }
});
app.listen(PORT, () => {
    console.log(`Auth-Service at ${PORT}`);
});
