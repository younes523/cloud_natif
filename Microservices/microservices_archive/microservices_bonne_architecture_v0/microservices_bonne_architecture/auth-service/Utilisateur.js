const mongoose = require('mongoose');

const UtilisateurSchema = mongoose.Schema({
  nom: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('utilisateur', UtilisateurSchema);
