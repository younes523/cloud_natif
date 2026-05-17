const mongoose = require('mongoose');

const CommandeSchema = mongoose.Schema({
  produit: String,
  email_utilisateur: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('commande', CommandeSchema);
