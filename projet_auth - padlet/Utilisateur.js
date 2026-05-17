mongoose = require('mongoose');
const UtilisateurSchema = mongoose.Schema({
    name:String,
    email : String,
    password:String,
    created_at:{
        type:Date,
        default:Date.now()
    }
},{collection:"users"});

module.exports = Utilisateur = mongoose.model("Utilisateur", UtilisateurSchema);