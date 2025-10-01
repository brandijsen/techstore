/**
 * Middleware per autorizzare solo gli admin
 */
function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.kind !== 'staff' || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accesso negato: solo admin' });
  }
  next();
}

module.exports = { authorizeAdmin };
