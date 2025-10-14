const { getPool } = require("../config/db");

const Attribute = {
  // C - Create
  create: async (name, category_id = null) => {
    const pool = await getPool();
    const [result] = await pool.execute(
      "INSERT INTO attributes (name, category_id) VALUES (?, ?)",
      [name, category_id]
    );
    return { id: result.insertId, name, category_id };
  },

  // R - Read All
  findAll: async () => {
    const pool = await getPool();
    const [rows] = await pool.execute(
      "SELECT a.*, c.name AS category_name FROM attributes a LEFT JOIN categories c ON a.category_id = c.id ORDER BY a.name ASC"
    );
    return rows;
  },

  // R - Read One
  findById: async (id) => {
    const pool = await getPool();
    const [rows] = await pool.execute(
      "SELECT a.*, c.name AS category_name FROM attributes a LEFT JOIN categories c ON a.category_id = c.id WHERE a.id = ?",
      [id]
    );
    return rows[0];
  },

  // U - Update
  update: async (id, name, category_id = null) => {
    const pool = await getPool();
    await pool.execute(
      "UPDATE attributes SET name = ?, category_id = ? WHERE id = ?",
      [name, category_id, id]
    );
    return { id, name, category_id };
  },

  // D - Delete
  remove: async (id) => {
    const pool = await getPool();
    await pool.execute("DELETE FROM attributes WHERE id = ?", [id]);
    return { message: "Attributo eliminato", id };
  },
};

module.exports = Attribute;
