const express = require('express');
const router = express.Router();
const { listProducts } = require('../controllers/demo.controller');

router.get('/demo/products', listProducts); // GET /api/demo/products

module.exports = router;
