const Product = require("../models/Product");


exports.getProducts = async (req, res) => {
  try {
    const { category, q } = req.query;
    let products;

    if (q) {
      // 🔍 Ricerca per nome o brand (case-insensitive)
      products = await Product.search(q);
    } else if (category) {
      // Filtra per categoria tramite slug
      products = await Product.findByCategorySlug(category);
    } else {
      // Nessun filtro → tutti i prodotti
      products = await Product.findAll();
    }

    res.json(products);
  } catch (err) {
    console.error("Errore nel recupero prodotti:", err);
    res.status(500).json({ error: "Errore nel recupero prodotti" });
  }
};


exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Prodotto non trovato" });
    res.json(product);
  } catch (err) {
    console.error("Errore in getProduct:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, brand, description, category_id } = req.body;
    const newProduct = await Product.create(name, brand, description, category_id);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Errore in createProduct:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Prodotto non trovato" });

    // Prendi i valori dal body oppure mantieni quelli esistenti
    const name = req.body.name ?? existing.name;
    const brand = req.body.brand ?? existing.brand;
    const description = req.body.description ?? existing.description;
    const category_id = req.body.category_id ?? existing.category_id;

    const updatedProduct = await Product.update(
      req.params.id,
      name,
      brand,
      description,
      category_id
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error("Errore in updateProduct:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.remove(req.params.id);
    res.json({ message: "Prodotto eliminato" });
  } catch (err) {
    console.error("Errore in deleteProduct:", err);
    res.status(500).json({ error: err.message });
  }
};
