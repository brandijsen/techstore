const Category = require("../models/Category");

// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero categorie" });
  }
};

// GET single category
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Categoria non trovata" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero categoria" });
  }
};

// POST create category
exports.createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const newCategory = await Category.create(name, slug);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Errore nella creazione categoria" });
  }
};

// PUT update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const updatedCategory = await Category.update(req.params.id, name, slug);
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: "Errore nell'aggiornamento categoria" });
  }
};

// DELETE remove category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.remove(req.params.id);
    res.json({ message: "Categoria eliminata" });
  } catch (err) {
    res.status(500).json({ error: "Errore nell'eliminazione categoria" });
  }
};
