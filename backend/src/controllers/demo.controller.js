const { getPool } = require('../config/db');

exports.listProducts = async (req, res, next) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT id, name, price, stock FROM products ORDER BY id DESC LIMIT 50'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
