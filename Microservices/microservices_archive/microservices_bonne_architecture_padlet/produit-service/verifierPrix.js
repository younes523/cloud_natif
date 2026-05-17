function verifierPrix(req, res, next) {
  const prix = Number(req.body.prix);

  if (Number.isNaN(prix)) {
    return res.status(400).json({ erreur_prix: 'prix invalide' });
  }

  if (prix < 100) {
    return res.status(400).json({ erreur_prix: 'prix trop bas' });
  }

  next();
}

module.exports = verifierPrix;
