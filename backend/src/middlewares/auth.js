const jwt = require('jsonwebtoken');

function getTokenFromReq(req) {
  const h = req.headers.authorization || '';
  if (h.startsWith('Bearer ')) return h.slice(7);
  if (req.cookies?.access_token) return req.cookies.access_token;
  return null;
}

function requireAuth(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) {
    const err = new Error('Missing access token');
    err.status = 401;
    return next(err);
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev_access_secret');
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (e) {
    e.status = 401;
    e.message = e.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return next(e);
  }
}

// opzionale per il Punto 2 (ruoli)
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
