const express = require('express');
const router = express.Router();
const { registerCustomer, loginCustomer, getCustomerProfile, updateCustomerName, updateCustomerEmail, updateCustomerPassword, logoutCustomer, deleteCustomerAccount, reactivateCustomerAccount, loginStaff, logoutStaff } = require('../controllers/auth.controller');
const authenticate = require('../middlewares/authenticate');

// =======================
// ROTTE AUTENTICAZIONE
// =======================

// Customer
router.post('/customer/login', loginCustomer);
router.post('/customer/register', registerCustomer);

router.get("/customer/me", authenticate, getCustomerProfile);
router.put('/customer/name', authenticate, updateCustomerName);
router.put('/customer/email', authenticate, updateCustomerEmail);
router.put('/customer/password', authenticate, updateCustomerPassword);
router.delete('/customer', authenticate, deleteCustomerAccount);
router.post('/customer/reactivate', reactivateCustomerAccount);

router.post('/customer/logout', logoutCustomer);

// Staff
router.post('/staff/login', loginStaff);
router.post('/staff/logout', logoutStaff);



module.exports = router;
