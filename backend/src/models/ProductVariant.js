const { getPool } = require("../config/db");

const ProductVariant = {
  // C - Create (stock_qty impostato automaticamente a 0)
  create: async (product_id, sku, price) => {
    const pool = await getPool();
    const [result] = await pool.execute(
      "INSERT INTO product_variants (product_id, sku, price, stock_qty) VALUES (?, ?, ?, 0)",
      [product_id, sku, price]
    );
    return { id: result.insertId, product_id, sku, price, stock_qty: 0 };
  },

  // R - Read all variants by product
  findAllByProduct: async (product_id) => {
    const pool = await getPool();
    const [rows] = await pool.execute(
      "SELECT * FROM product_variants WHERE product_id = ? ORDER BY id DESC",
      [product_id]
    );
    return rows;
  },

  // R - Read single variant
  findById: async (id) => {
    const pool = await getPool();
    const [rows] = await pool.execute("SELECT * FROM product_variants WHERE id = ?", [id]);
    return rows[0];
  },

  // U - Update (stock_qty non aggiornabile manualmente)
  update: async (id, sku, price) => {
    const pool = await getPool();
    await pool.execute(
      "UPDATE product_variants SET sku = ?, price = ? WHERE id = ?",
      [sku, price, id]
    );
    return { id, sku, price };
  },

  // D - Delete
  remove: async (id) => {
    const pool = await getPool();
    await pool.execute("DELETE FROM product_variants WHERE id = ?", [id]);
    return { message: "Variante eliminata" };
  },
};

module.exports = ProductVariant;
