const express = require("express");
const app = express();
//const PORT = process.env.PORT_ONE || 4002;
const PORT = 4000;
//Mongoose => an Object Data Modeling (ODM) library for MongoDB and Node.js.
const mongoose = require("mongoose");
const Utilisateur = require("./Utilisateur");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

app.use(express.json());
/********************************************************************************/

mongoose.connect("mongodb://127.0.0.1:27017/auth-service", {  //auth-service => DB name
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log(`Auth-Service DB Connected`);
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });


/********************************************************************************/
// la méthode register permettera de créer et d'ajouter un nouvel utilisateur à la base de données
app.post("/auth/register", async (req, res) => {
    let { nom, email, password } = req.body;
    //On vérifie si le nouvel utilisateur est déjà inscrit avec la même adresse email ou pas
    const userExists = await Utilisateur.findOne({
        email
    });
    if (userExists) {
        return res.json({ message: "Cet utilisateur existe déjà" });
    } else {//This number 10 determines the number of iterations or work factor used by the hashing algorithm. Increasing this value makes the hash more computationally expensive to compute, thereby making brute-force attacks less feasible.
        //bcrypt.hash(password, 10, (err, hash) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err,
                });
            } else {
                password = hash;
                const newUtilisateur = new
                    Utilisateur({
                        nom,
                        email,
                        password
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

/********************************************************************************/

//la méthode login permettra de retourner un token  après vérification de l'email et du mot de passe
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const utilisateur = await Utilisateur.findOne({
        email
    });
    if (!utilisateur) {
        return res.json({
            message: "Utilisateur introuvable"
        });
    } else {
        bcrypt.compare(password,utilisateur.password)
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
                    jwt.sign(payload, "secret", (err,token) => {
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

/********************************************************************************/

app.listen(PORT, () => {
    console.log(`Auth-Service at ${PORT}`);
});
