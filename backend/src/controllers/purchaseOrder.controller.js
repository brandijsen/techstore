const PurchaseOrder = require("../models/PurchaseOrder");

exports.createPO = async (req, res) => {
  try {
    const { supplier_name, items } = req.body;
    if (!supplier_name || !Array.isArray(items) || !items.length)
      return res.status(400).json({ error: "Dati ordine fornitore incompleti" });

    const po = await PurchaseOrder.create(supplier_name, items);
    res.status(201).json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.receivePO = async (req, res) => {
  try {
    const result = await PurchaseOrder.receive(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPO = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ error: "Ordine non trovato" });
    res.json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPO = async (req, res) => {
  try {
    const pos = await PurchaseOrder.findAll();
    res.json(pos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
