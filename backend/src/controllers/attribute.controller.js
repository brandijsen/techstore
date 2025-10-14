const Attribute = require("../models/Attribute");

exports.getAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.findAll();
    res.json(attributes);
  } catch (err) {
    console.error("Errore in getAttributes:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) return res.status(404).json({ error: "Attributo non trovato" });
    res.json(attribute);
  } catch (err) {
    console.error("Errore in getAttribute:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createAttribute = async (req, res) => {
  try {
    const { name, category_id } = req.body;
    const newAttribute = await Attribute.create(name, category_id);
    res.status(201).json(newAttribute);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Attributo già esistente" });
    }
    console.error("Errore in createAttribute:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateAttribute = async (req, res) => {
  try {
    const { name, category_id } = req.body;
    const updated = await Attribute.update(req.params.id, name, category_id);
    res.json(updated);
  } catch (err) {
    console.error("Errore in updateAttribute:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAttribute = async (req, res) => {
  try {
    await Attribute.remove(req.params.id);
    res.json({ message: "Attributo eliminato" });
  } catch (err) {
    console.error("Errore in deleteAttribute:", err);
    res.status(500).json({ error: err.message });
  }
};
