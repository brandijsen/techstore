const express = require('express');
const router = express.Router();
const { registerCustomer, loginCustomer, logoutCustomer, deleteCustomerAccount, loginStaff, logoutStaff } = require('../controllers/auth.controller');
const authenticate = require('../middlewares/authenticate');

// =======================
// ROTTE AUTENTICAZIONE
// =======================

// Customer
router.post('/customer/login', loginCustomer);
router.post('/customer/register', registerCustomer);7
router.delete('/customer', authenticate, deleteCustomerAccount);

router.post('/customer/logout', logoutCustomer);

// Staff
router.post('/staff/login', loginStaff);
router.post('/staff/logout', logoutStaff);

// TODO: aggiungeremo qui anche:
// - /customer/register
// - /customer/logout
// - /staff/login
// - ecc.

module.exports = router;
