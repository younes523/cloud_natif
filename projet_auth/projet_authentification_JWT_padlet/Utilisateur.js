const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Ne pas oublier l'import !

const UtilisateurSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    created_at: {
        type: Date,
        default: Date.now
    }
}, { collection: "users" });

// // --- MIDDLEWARES (Doivent être AVANT le model) ---
// //Ce middleware se déclenche avant chaque insertion ou MAJ (si on récupères d'abord le document, puis qu'on le sauvegarde, EX: const user = await Utilisateur.findById(id); user.password = "nouveauPass123"; await user.save();)
// UtilisateurSchema.pre('save', async function(next) {
//     console.log("Préparation de la sauvegarde de :", this.name);
//     if (this.isModified('password')) {
//         // Le hachage s'appliquera bien car défini avant la compilation du modèle
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// --- EXPORT (Toujours en dernier) ---

// On compile et on exporte le modèle à la fin
module.exports = mongoose.model("Utilisateur", UtilisateurSchema);