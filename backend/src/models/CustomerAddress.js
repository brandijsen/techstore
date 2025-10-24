const { getPool } = require("../config/db");

const CustomerAddress = {
  create: async (customer_id, full_name, phone, address_line, city, postal_code, province, country, is_default) => {
    const pool = await getPool();
    const [result] = await pool.execute(
      `INSERT INTO customer_addresses
      (customer_id, full_name, phone, address_line, city, postal_code, province, country, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, full_name, phone, address_line, city, postal_code, province, country, is_default || false]
    );
    return { id: result.insertId };
  },

  findByCustomer: async (customer_id) => {
    const pool = await getPool();
    const [rows] = await pool.execute(
      `SELECT * FROM customer_addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC`,
      [customer_id]
    );
    return rows;
  },

  update: async (id, customer_id, data) => {
    const pool = await getPool();
    const [result] = await pool.execute(
      `UPDATE customer_addresses
       SET full_name=?, phone=?, address_line=?, city=?, postal_code=?, province=?, country=?, is_default=?
       WHERE id=? AND customer_id=?`,
      [
        data.full_name, data.phone, data.address_line, data.city, data.postal_code,
        data.province, data.country, data.is_default, id, customer_id
      ]
    );
    return result.affectedRows > 0;
  },

  remove: async (id, customer_id) => {
    const pool = await getPool();
    const [result] = await pool.execute(
      `DELETE FROM customer_addresses WHERE id=? AND customer_id=?`,
      [id, customer_id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = CustomerAddress;
