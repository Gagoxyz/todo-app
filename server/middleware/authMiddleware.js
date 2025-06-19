// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];

  if (!token)
    return res.status(401).json({ msg: 'Acceso denegado. No hay token.' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Aquí tienes acceso a req.user.id y req.user.username
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
}

module.exports = authMiddleware;
