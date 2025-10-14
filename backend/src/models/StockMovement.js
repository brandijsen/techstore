const { getPool } = require("../config/db");

const StockMovement = {
  replenish: async (items) => {
    const pool = await getPool();
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      for (const item of items) {
        const { variant_id, quantity, note } = item;
        if (!variant_id || !quantity || quantity <= 0) {
          throw new Error("Ogni item deve contenere variant_id e quantity > 0");
        }

        await conn.execute(
          "INSERT INTO stock_movements (variant_id, movement_type, quantity, note) VALUES (?, 'REPLENISH', ?, ?)",
          [variant_id, quantity, note || null]
        );

        await conn.execute(
          "UPDATE product_variants SET stock_qty = stock_qty + ? WHERE id = ?",
          [quantity, variant_id]
        );
      }

      await conn.commit();
      conn.release();
      return { message: `${items.length} replenish movements registered successfully.` };
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  },

   sale: async (items) => {
    const pool = await getPool();
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      for (const item of items) {
        const { variant_id, quantity, note } = item;
        if (!variant_id || !quantity || quantity <= 0) {
          throw new Error("Ogni item deve contenere variant_id e quantity > 0");
        }

        // 1️⃣ Verifica stock
        const [rows] = await conn.execute(
          "SELECT stock_qty FROM product_variants WHERE id = ?",
          [variant_id]
        );
        if (!rows.length) throw new Error(`Variante ${variant_id} non trovata`);
        if (rows[0].stock_qty < quantity)
          throw new Error(`Stock insufficiente per variante ${variant_id}`);

        // 2️⃣ Registra movimento
        await conn.execute(
          "INSERT INTO stock_movements (variant_id, movement_type, quantity, note) VALUES (?, 'SALE', ?, ?)",
          [variant_id, quantity, note || null]
        );

        // 3️⃣ Aggiorna stock
        await conn.execute(
          "UPDATE product_variants SET stock_qty = stock_qty - ? WHERE id = ?",
          [quantity, variant_id]
        );
      }

      await conn.commit();
      conn.release();
      return { message: `${items.length} sale movements registered successfully.` };
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  },

  findByVariant: async (variant_id) => {
    const pool = await getPool();
    const [rows] = await pool.execute(
      "SELECT * FROM stock_movements WHERE variant_id = ? ORDER BY created_at DESC",
      [variant_id]
    );
    return rows;
  },
};

module.exports = StockMovement;
