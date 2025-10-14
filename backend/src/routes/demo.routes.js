const express = require('express');
const router = express.Router();
const { listProducts } = require('../controllers/demo.controller');
const authenticate = require('../middlewares/authenticate');


// Rotta di test pubblica
router.get('/demo/public', (req, res) => {
  res.json({ message: 'Questa è pubblica, nessun token richiesto' });
});

// Rotta di test privata
router.get('/demo/private', authenticate, (req, res) => {
  res.json({
    message: 'Questa è privata, hai un token valido!',
    user: req.user, // payload dal token
  });
});

router.get('/demo/products', listProducts); // GET /api/demo/products

module.exports = router;
