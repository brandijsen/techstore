const VariantAttribute = require("../models/VariantAttribute");

exports.getAttributesByVariant = async (req, res) => {
  try {
    const rows = await VariantAttribute.findAllByVariant(req.params.variantId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createVariantAttribute = async (req, res) => {
  try {
    const { variant_id, attribute_id, value } = req.body;
    const newAttr = await VariantAttribute.create(variant_id, attribute_id, value);
    res.status(201).json(newAttr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVariantAttribute = async (req, res) => {
  try {
    const result = await VariantAttribute.remove(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
