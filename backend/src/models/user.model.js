const { getPool } = require('../config/db');

async function findByEmail(email) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function createUser({ name, email, passwordHash, role = 'customer' }) {
  const pool = await getPool();
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, role]
  );
  return { id: result.insertId, name, email, role };
}

async function findWithPasswordById(id) {
  const pool = await getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, password_hash FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

async function anonymizeUser(id, newPasswordHash) {
  const pool = await getPool();
  const [result] = await pool.execute(
    `UPDATE users
       SET name = 'Deleted User',
           email = CONCAT('deleted_', id, '_', UNIX_TIMESTAMP(), '@example.invalid'),
           password_hash = ?,
           updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [newPasswordHash, id]
  );
  return result.affectedRows === 1;
}


module.exports = { findByEmail, createUser, findWithPasswordById, anonymizeUser };
