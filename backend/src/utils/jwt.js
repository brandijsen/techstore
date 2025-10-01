const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Firma un nuovo token JWT
 * @param {Object} payload - dati da inserire nel token (es. { sub: userId, kind: 'customer' })
 * @param {String} expiresIn - opzionale, durata del token
 * @returns {String} token JWT
 */
function signToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verifica un token JWT
 * @param {String} token - token da verificare
 * @returns {Object|null} payload decodificato o null se non valido
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Decodifica un token senza verificarne la firma
 * ⚠️ utile solo per debug, non per autenticazione!
 */
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  signToken,
  verifyToken,
  decodeToken,
};
