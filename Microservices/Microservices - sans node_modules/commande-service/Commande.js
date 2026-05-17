const mongoose = require("mongoose");
const CommandeSchema = mongoose.Schema({
    produit: String,
    email_utilisateur: String
    
});
module.exports = Commande = mongoose.model("commande", CommandeSchema);