const express = require('express');
const router = express.Router();
const { createEmployee, listEmployees, employeeRequestChangeCredentials, handleChangeRequest, deactivateEmployee, activateEmployee, updateAdminCredentials } = require('../controllers/staff.controller');
const authenticate = require('../middlewares/authenticate');
const { authorizeAdmin } = require('../middlewares/authorize');

// Solo admin può creare un nuovo employee
router.patch('/admin/credentials', authenticate, authorizeAdmin, updateAdminCredentials);
router.post('/', authenticate, authorizeAdmin, createEmployee);
router.get('/', authenticate, authorizeAdmin, listEmployees);
router.post('/change-request', authenticate, employeeRequestChangeCredentials);
router.post('/change-request/:id/decision', authenticate, authorizeAdmin, handleChangeRequest);
router.patch('/:id/deactivate', authenticate, authorizeAdmin, deactivateEmployee);
router.patch('/:id/activate', authenticate, authorizeAdmin, activateEmployee);

module.exports = router;
