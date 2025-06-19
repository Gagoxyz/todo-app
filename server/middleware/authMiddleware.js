// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];

  if (!token)
    return res.status(401).json({ msg: 'Acceso denegado. No hay token.' });

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
}

module.exports = authMiddleware;
