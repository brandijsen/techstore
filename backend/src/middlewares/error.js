// 404
function notFound(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
}

// Global error handler
function errorHandler(err, req, res, next) { // eslint-disable-line
  // Mappa alcuni errori comuni
  const mapStatus =
    err.status ||
    (err.name === 'ZodError' ? 400 :
     err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError' ? 401 :
     500);

  const payload = {
    error: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.name = err.name;
    if (err.details) payload.details = err.details; // zod flatten
    // payload.stack = err.stack; // scommenta in dev se vuoi
  }

  res.status(mapStatus).json(payload);
}

module.exports = { notFound, errorHandler };
