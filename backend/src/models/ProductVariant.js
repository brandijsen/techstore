const { getPool } = require("../config/db");

const ProductVariant = {
  create: async (product_id, sku, price, stock_qty) => {
    const pool = await getPool();
    const [result] = await pool.execute(
      "INSERT INTO product_variants (product_id, sku, price, stock_qty) VALUES (?, ?, ?, ?)",
      [product_id, sku, price, stock_qty]
    );
    return { id: result.insertId, product_id, sku, price, stock_qty };
  },

  findAllByProduct: async (product_id) => {
    const pool = await getPool();
    const [rows] = await pool.execute(
      "SELECT * FROM product_variants WHERE product_id = ? ORDER BY id DESC",
      [product_id]
    );
    return rows;
  },

  findById: async (id) => {
    const pool = await getPool();
    const [rows] = await pool.execute("SELECT * FROM product_variants WHERE id = ?", [id]);
    return rows[0];
  },

  update: async (id, sku, price, stock_qty) => {
    const pool = await getPool();
    await pool.execute(
      "UPDATE product_variants SET sku = ?, price = ?, stock_qty = ? WHERE id = ?",
      [sku, price, stock_qty, id]
    );
    return { id, sku, price, stock_qty };
  },

  remove: async (id) => {
    const pool = await getPool();
    await pool.execute("DELETE FROM product_variants WHERE id = ?", [id]);
    return { message: "Variante eliminata" };
  },
};

module.exports = ProductVariant;
