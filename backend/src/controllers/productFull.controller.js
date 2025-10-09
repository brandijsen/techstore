const { getPool } = require("../config/db");

exports.createFullProduct = async (req, res) => {
  const pool = await getPool();
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const { name, brand, description, category_id, variants } = req.body;

    // 1️⃣ Crea il prodotto base
    const [prodResult] = await connection.execute(
      "INSERT INTO products (name, brand, description, category_id) VALUES (?, ?, ?, ?)",
      [name, brand, description, category_id]
    );
    const product_id = prodResult.insertId;

    const createdVariants = [];

    // 2️⃣ Cicla sulle varianti e crea ciascuna di esse
    for (const variant of variants) {
      const { sku, price, stock_qty, attributes } = variant;

      const [varResult] = await connection.execute(
        "INSERT INTO product_variants (product_id, sku, price, stock_qty) VALUES (?, ?, ?, ?)",
        [product_id, sku, price, stock_qty]
      );
      const variant_id = varResult.insertId;

      const createdAttrs = [];

      // 3️⃣ Cicla sugli attributi di quella variante
      for (const attr of attributes) {
        const { attribute_id, value } = attr;
        const [attrResult] = await connection.execute(
          "INSERT INTO variant_attributes (variant_id, attribute_id, value) VALUES (?, ?, ?)",
          [variant_id, attribute_id, value]
        );
        createdAttrs.push({
          id: attrResult.insertId,
          attribute_id,
          value,
        });
      }

      createdVariants.push({
        id: variant_id,
        sku,
        price,
        stock_qty,
        attributes: createdAttrs,
      });
    }

    await connection.commit();

    res.status(201).json({
      message: "Prodotto creato con successo",
      product: {
        id: product_id,
        name,
        brand,
        description,
        category_id,
        variants: createdVariants,
      },
    });
  } catch (err) {
    await connection.rollback();
    console.error("Errore createFullProduct:", err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};


exports.getFullProduct = async (req, res) => {
  try {
    const pool = await getPool();
    const productId = req.params.id;

    // 1️⃣ Recupera il prodotto base + nome categoria
    const [productRows] = await pool.execute(
      `SELECT p.*, c.name AS category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ error: "Prodotto non trovato" });
    }

    const product = productRows[0];

    // 2️⃣ Recupera tutte le varianti del prodotto
    const [variantRows] = await pool.execute(
      "SELECT * FROM product_variants WHERE product_id = ?",
      [productId]
    );

    // 3️⃣ Recupera tutti gli attributi di ogni variante
    for (const variant of variantRows) {
      const [attrRows] = await pool.execute(
        `SELECT a.name, va.value
         FROM variant_attributes va
         JOIN attributes a ON va.attribute_id = a.id
         WHERE va.variant_id = ?`,
        [variant.id]
      );
      variant.attributes = attrRows;
    }

    // 4️⃣ Aggiungi le varianti al prodotto
    product.variants = variantRows;

    res.json(product);
  } catch (err) {
    console.error("Errore getFullProduct:", err);
    res.status(500).json({ error: err.message });
  }
};
