const { getPool } = require("../config/db");

const AttributeCategory = {
  link: async (attribute_id, category_id) => {
    const pool = await getPool();
    const [result] = await pool.execute(
      "INSERT INTO attribute_category (attribute_id, category_id) VALUES (?, ?)",
      [attribute_id, category_id]
    );
    return { id: result.insertId, attribute_id, category_id };
  },

  findByCategory: async (category_id) => {
    const pool = await getPool();
    const [rows] = await pool.execute(
      `SELECT a.id AS attribute_id, a.name
       FROM attribute_category ac
       JOIN attributes a ON a.id = ac.attribute_id
       WHERE ac.category_id = ?`,
      [category_id]
    );
    return rows;
  },

  unlink: async (attribute_id, category_id) => {
    const pool = await getPool();
    await pool.execute(
      "DELETE FROM attribute_category WHERE attribute_id = ? AND category_id = ?",
      [attribute_id, category_id]
    );
    return { message: "Associazione attributo-categoria rimossa" };
  },
};

module.exports = AttributeCategory;
