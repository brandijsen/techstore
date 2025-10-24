const CustomerAddress = require("../models/CustomerAddress");

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await CustomerAddress.findByCustomer(req.user.sub);
    res.json(addresses);
  } catch (err) {
    console.error("Errore getAddresses:", err);
    res.status(500).json({ error: "Errore nel recupero indirizzi" });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { full_name, phone, address_line, city, postal_code, province, country, is_default } = req.body;
    const result = await CustomerAddress.create(req.user.sub, full_name, phone, address_line, city, postal_code, province, country, is_default);
    res.status(201).json({ id: result.id, message: "Indirizzo aggiunto con successo" });
  } catch (err) {
    console.error("Errore createAddress:", err);
    res.status(500).json({ error: "Errore nella creazione indirizzo" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const updated = await CustomerAddress.update(req.params.id, req.user.sub, req.body);
    if (!updated) return res.status(404).json({ error: "Indirizzo non trovato o non autorizzato" });
    res.json({ message: "Indirizzo aggiornato con successo" });
  } catch (err) {
    console.error("Errore updateAddress:", err);
    res.status(500).json({ error: "Errore aggiornamento indirizzo" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const deleted = await CustomerAddress.remove(req.params.id, req.user.sub);
    if (!deleted) return res.status(404).json({ error: "Indirizzo non trovato o non autorizzato" });
    res.json({ message: "Indirizzo eliminato con successo" });
  } catch (err) {
    console.error("Errore deleteAddress:", err);
    res.status(500).json({ error: "Errore eliminazione indirizzo" });
  }
};
