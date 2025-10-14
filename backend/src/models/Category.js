const { getPool } = require("../config/db");

const Category = {
  // C - Create
  create: async (name, slug) => {
        const pool = await getPool();
    const [result] = await pool.execute(
      "INSERT INTO categories (name, slug) VALUES (?, ?)",
      [name, slug]
    );
    return { id: result.insertId, name, slug };
  },

  // R - Read All
  findAll: async () => {
        const pool = await getPool();

    const [rows] = await pool.execute("SELECT * FROM categories ORDER BY created_at DESC");
    return rows;
  },

  // R - Read One
  findById: async (id) => {
        const pool = await getPool();

    const [rows] = await pool.execute("SELECT * FROM categories WHERE id = ?", [id]);
    return rows[0];
  },

  // U - Update
  update: async (id, name, slug) => {
        const pool = await getPool();

    await pool.execute("UPDATE categories SET name = ?, slug = ? WHERE id = ?", [
      name,
      slug,
      id,
    ]);
    return { id, name, slug };
  },

  // D - Delete
  remove: async (id) => {
        const pool = await getPool();

    await pool.execute("DELETE FROM categories WHERE id = ?", [id]);
    return { message: "Categoria eliminata", id };
  },
};

module.exports = Category;
