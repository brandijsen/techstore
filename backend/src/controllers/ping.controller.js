const { healthCheck } = require('../config/db');

exports.ping = (req, res) => {
  res.json({ message: 'pong' });
};

exports.dbHealth = async (req, res) => {
  // se la connessione fallisce, consideriamo "down" e NON lanciamo errori
  const ok = await healthCheck().catch(() => false);
  res.json({ db: ok ? 'up' : 'down' });
};
