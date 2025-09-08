// 404
function notFound(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
}

// Error handler
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = { notFound, errorHandler };
