const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Utilisateur = require("./Utilisateur");

const port = 3000;

app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/auth_db")
.then(() => {
    console.log(`connexion successfully established to mongodb`);
})
.catch((error) => {
    console.error("failed to connect to mongodb with the error : ",error);
});


app.post('/auth/register', async (req,res)=>{
    let {name, email, password} = req.body;

    const user = await Utilisateur.findOne({email});
    if(user){
        return res.status(500).json({error:"this user exists already"});
    }
    
    bcrypt.hash(password,11,((err, hash) => { 
        //11 = facteur de coût : plus il est élevé, plus c'est sécurisé mais lent (par défaut = 10). Un sel ("salt") aléatoire est automatiquement généré et ajouté au mot de passe avant le hachage.
        if(err){
            return res.status(500).json({error : err});
        }
        else{
            password = hash;
            const new_utilisateur = new Utilisateur({
                name,email,password
            });
            new_utilisateur.save()
            .then(()=>{
                return res.status(201).json({message:"user registered successfully!"});
            })
            .catch((err)=>{
                return res.status(500).json({error:err});
            })
        }
    }));
});

app.post('/auth/login', async (req,res) => {
   
    const {email, password} = req.body;
    const user = await Utilisateur.findOne({email});
    if(!user){ //si user est null
      return res.status(500).json({error : "user doesn't exist"});
    }
    else{

        //Comparer le mot de passe saisi avec le hash de la base
        // Bcrypt va extraire tout seul le salt du 'user.password'
        bcrypt.compare(password, user.password)
        .then( (result) => {
           if(!result){
                return res.status(500).json({error:"password incorrect"});
           } 
           else{
                const payload={
                    name:user.name,
                    email:user.email
                }
                jwt.sign(payload, 'secret', (err,token) => {
                    if(err){
                        return res.status(500).json({error:err})
                    }
                    return res.status(201).json({token});
                });
           }
        }

        )
    }
});

app.listen(port,() => {
    console.log(`app launched successfully on http://localhost:${port}`);
});
