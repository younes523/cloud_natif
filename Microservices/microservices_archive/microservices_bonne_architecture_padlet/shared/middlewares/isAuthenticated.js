const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwtConfig');

function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Token manquant ou mal formé. Utilisez Authorization: Bearer <token>.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token invalide ou expiré.',
    });
  }
}

module.exports = isAuthenticated;
