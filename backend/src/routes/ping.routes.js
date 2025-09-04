const express = require('express');
const router = express.Router();
const { ping, dbHealth } = require('../controllers/ping.controller');

router.get('/ping', ping);
router.get('/health', dbHealth);

module.exports = router;
