const { getPool } = require("../config/db");

const Product = {
  // C - Create
  create: async (name, brand, description, category_id) => {
    const pool = await getPool();

    const [rows] = await pool.execute("SELECT id FROM products WHERE name = ?", [name]);
    if (rows.length > 0) {
      throw new Error("Un prodotto con questo nome esiste già");
    }

    const [result] = await pool.execute(
      "INSERT INTO products (name, brand, description, category_id) VALUES (?, ?, ?, ?)",
      [name, brand, description, category_id]
    );
    return { id: result.insertId, name, brand, description, category_id };
  },

  // R - Read All (con join categorie)
findAll: async () => {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    return rows;
  },

  findByCategorySlug: async (slug) => {
    const pool = await getPool();
    const [rows] = await pool.execute(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ?
      ORDER BY p.created_at DESC
    `, [slug]);
    return rows;
  },

  // R - Read One
  findById: async (id) => {
    const pool = await getPool();
    const [rows] = await pool.execute(
      `SELECT p.*, c.name AS category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  },

  search: async (query) => {
  const pool = await getPool();
  const like = `%${query}%`;
  const [rows] = await pool.execute(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.name LIKE ? OR p.brand LIKE ?
    ORDER BY p.created_at DESC
  `, [like, like]);
  return rows;
},

  // U - Update
  update: async (id, name, brand, description, category_id) => {
    const pool = await getPool();
    await pool.execute(
      "UPDATE products SET name = ?, brand = ?, description = ?, category_id = ? WHERE id = ?",
      [name, brand, description, category_id, id]
    );
    return { id, name, brand, description, category_id };
  },

  // D - Delete
  remove: async (id) => {
    const pool = await getPool();
    await pool.execute("DELETE FROM products WHERE id = ?", [id]);
    return { message: "Prodotto eliminato", id };
  },
};

module.exports = Product;
