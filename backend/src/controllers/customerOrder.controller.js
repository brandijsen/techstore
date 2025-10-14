const CustomerOrder = require("../models/CustomerOrder");

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

if (!Array.isArray(items) || !items.length) {
  return res.status(400).json({ error: "Dati ordine incompleti" });
}

// prendo l'id cliente dal token JWT
const customer_id = req.user.sub;
const order = await CustomerOrder.create(customer_id, items);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    const result = await CustomerOrder.confirm(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await CustomerOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Ordine non trovato" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await CustomerOrder.findByCustomer(req.params.customerId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
