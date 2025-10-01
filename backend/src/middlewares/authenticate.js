const { verifyToken } = require('../utils/jwt');

/**
 * Middleware per autenticare una richiesta tramite JWT.
 * Se valido: aggiunge req.user con payload del token.
 * Se invalido/mancante: risponde 401.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante o invalido' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Token non valido o scaduto' });
  }

  // payload contiene { sub, kind, role? }
  req.user = payload;
  next();
}

module.exports = authenticate;
