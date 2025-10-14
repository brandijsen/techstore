const { getPool } = require("../config/db");
const StockMovement = require("./StockMovement");

const PurchaseOrder = {
  // Crea un nuovo ordine fornitore (stato DRAFT)
  create: async (supplier_name, items) => {
    const pool = await getPool();
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      let total = 0;
      for (const i of items) total += i.quantity * i.unit_cost;

      // Genera codice ordine
      const [last] = await conn.execute("SELECT id FROM purchase_orders ORDER BY id DESC LIMIT 1");
      const nextId = last.length ? last[0].id + 1 : 1;
      const po_code = `PO-${new Date().getFullYear()}-${String(nextId).padStart(4, "0")}`;

      const [res] = await conn.execute(
        "INSERT INTO purchase_orders (supplier_name, po_code, total) VALUES (?, ?, ?)",
        [supplier_name, po_code, total]
      );
      const poId = res.insertId;

      // Inserisci righe
      for (const { variant_id, quantity, unit_cost } of items) {
        await conn.execute(
          "INSERT INTO purchase_order_items (purchase_order_id, variant_id, quantity, unit_cost) VALUES (?, ?, ?, ?)",
          [poId, variant_id, quantity, unit_cost]
        );
      }

      await conn.commit();
      conn.release();
      return { id: poId, po_code, status: "DRAFT", total, items };
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  },

  // Conferma ricezione → aggiorna stock
  receive: async (poId) => {
    const pool = await getPool();

    const [rows] = await pool.execute(
      "SELECT variant_id, quantity FROM purchase_order_items WHERE purchase_order_id = ?",
      [poId]
    );
    if (!rows.length) throw new Error("Ordine fornitore vuoto o non trovato");

    // Prepara array per StockMovement.replenish()
    const items = rows.map((r) => ({
      variant_id: r.variant_id,
      quantity: r.quantity,
      note: `Purchase order #${poId}`,
    }));

    // Aumenta stock e registra movimenti
    await StockMovement.replenish(items);

    // Aggiorna stato ordine
    await pool.execute("UPDATE purchase_orders SET status = 'RECEIVED' WHERE id = ?", [poId]);

    return { message: `Ordine fornitore #${poId} ricevuto e stock aggiornato.` };
  },

  findById: async (poId) => {
    const pool = await getPool();
    const [orders] = await pool.execute("SELECT * FROM purchase_orders WHERE id = ?", [poId]);
    if (!orders.length) return null;

    const [items] = await pool.execute(
      "SELECT * FROM purchase_order_items WHERE purchase_order_id = ?",
      [poId]
    );
    orders[0].items = items;
    return orders[0];
  },

  findAll: async () => {
    const pool = await getPool();
    const [rows] = await pool.execute("SELECT * FROM purchase_orders ORDER BY order_date DESC");
    return rows;
  },
};

module.exports = PurchaseOrder;
