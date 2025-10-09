const { getPool } = require("../config/db");

const VariantAttribute = {
  create: async (variant_id, attribute_id, value) => {
    const pool = await getPool();
    const [result] = await pool.execute(
      "INSERT INTO variant_attributes (variant_id, attribute_id, value) VALUES (?, ?, ?)",
      [variant_id, attribute_id, value]
    );
    return { id: result.insertId, variant_id, attribute_id, value };
  },

  findAllByVariant: async (variant_id) => {
    const pool = await getPool();
    const [rows] = await pool.execute(
      `SELECT va.*, a.name AS attribute_name
       FROM variant_attributes va
       JOIN attributes a ON va.attribute_id = a.id
       WHERE va.variant_id = ?`,
      [variant_id]
    );
    return rows;
  },

  remove: async (id) => {
    const pool = await getPool();
    await pool.execute("DELETE FROM variant_attributes WHERE id = ?", [id]);
    return { message: "Attributo della variante eliminato" };
  },
};

module.exports = VariantAttribute;
