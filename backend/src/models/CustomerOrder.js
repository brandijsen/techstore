const { getPool } = require("../config/db");
const StockMovement = require("./StockMovement");

const CustomerOrder = {
  // Creazione ordine PENDING
  create: async (customer_id, items) => {
  const pool = await getPool();
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    // Calcola totale
    let total = 0;
    for (const i of items) total += i.quantity * i.unit_price;

    // Genera codice ordine univoco
    const [last] = await conn.execute(
      "SELECT id FROM customer_orders ORDER BY id DESC LIMIT 1"
    );
    const nextId = last.length ? last[0].id + 1 : 1;
    const order_code = `ORD-${new Date().getFullYear()}-${String(nextId).padStart(4, "0")}`;

    // Inserisci testata ordine
    const [resOrder] = await conn.execute(
      "INSERT INTO customer_orders (customer_id, order_code, total) VALUES (?, ?, ?)",
      [customer_id, order_code, total]
    );

    const orderId = resOrder.insertId;

    // Inserisci righe
    for (const { variant_id, quantity, unit_price } of items) {
      await conn.execute(
        "INSERT INTO customer_order_items (order_id, variant_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
        [orderId, variant_id, quantity, unit_price]
      );
    }

    await conn.commit();
    conn.release();
    return { id: orderId, order_code, status: "PENDING", total, items };
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
},

  // Conferma ordine → scarico stock e movimenti SALE
  confirm: async (orderId) => {
  const pool = await getPool();

  // Ottieni le righe dell'ordine
  const [rows] = await pool.execute(
    "SELECT variant_id, quantity FROM customer_order_items WHERE order_id = ?",
    [orderId]
  );
  if (!rows.length) throw new Error("Ordine vuoto o non trovato");

  // Prepara array per StockMovement.sale()
  const items = rows.map((r) => ({
    variant_id: r.variant_id,
    quantity: r.quantity,
    note: `Customer order #${orderId}`,
  }));

  // Esegui aggiornamento stock e movimenti
  await StockMovement.sale(items);

  // Aggiorna stato ordine
  await pool.execute(
    "UPDATE customer_orders SET status = 'CONFIRMED' WHERE id = ?",
    [orderId]
  );

  return { message: `Ordine #${orderId} confermato e stock aggiornato.` };
},


  findById: async (orderId) => {
    const pool = await getPool();
    const [orders] = await pool.execute("SELECT * FROM customer_orders WHERE id = ?", [orderId]);
    if (!orders.length) return null;

    const [items] = await pool.execute(
      "SELECT * FROM customer_order_items WHERE order_id = ?",
      [orderId]
    );
    orders[0].items = items;
    return orders[0];
  },

  findByCustomer: async (customer_id) => {
    const pool = await getPool();
    const [rows] = await pool.execute(
      "SELECT * FROM customer_orders WHERE customer_id = ? ORDER BY order_date DESC",
      [customer_id]
    );
    return rows;
  },
};

module.exports = CustomerOrder;
