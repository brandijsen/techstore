const ProductVariant = require("../models/ProductVariant");

exports.getVariantsByProduct = async (req, res) => {
  try {
    const variants = await ProductVariant.findAllByProduct(req.params.productId);
    res.json(variants);
  } catch (err) {
    console.error("Errore getVariantsByProduct:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id);
    if (!variant) return res.status(404).json({ error: "Variante non trovata" });
    res.json(variant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createVariant = async (req, res) => {
  try {
    const { product_id, sku, price, stock_qty } = req.body;
    const newVariant = await ProductVariant.create(product_id, sku, price, stock_qty);
    res.status(201).json(newVariant);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "SKU già esistente" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    const { sku, price, stock_qty } = req.body;
    const updated = await ProductVariant.update(req.params.id, sku, price, stock_qty);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const result = await ProductVariant.remove(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
