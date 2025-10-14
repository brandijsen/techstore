const AttributeCategory = require("../models/AttributeCategory");

exports.link = async (req, res) => {
  try {
    const { attribute_id, category_id } = req.body;
    const link = await AttributeCategory.link(attribute_id, category_id);
    res.status(201).json(link);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Associazione già esistente" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const rows = await AttributeCategory.findByCategory(req.params.categoryId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlink = async (req, res) => {
  try {
    const { attribute_id, category_id } = req.body;
    const result = await AttributeCategory.unlink(attribute_id, category_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
