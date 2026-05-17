const verifierPrix = (req,res,next) => {
    const prix = parseInt(req.body.prix);
    if(prix < 100){
        res.send({erreur_prix:"prix trop bas"});
    }
    else{
        next();
    }
}

module.exports = verifierPrix;