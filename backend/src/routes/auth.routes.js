const { Router } = require('express');
const { register, login, logout, me, deleteMe } = require('../controllers/auth.controller');
const { registerSchema, loginSchema, deleteAccountSchema, validate } = require('../validators/auth.schemas');
const { requireAuth } = require('../middlewares/auth');

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, me);
router.post('/logout', logout);
router.delete('/me', requireAuth, validate(deleteAccountSchema), deleteMe);


module.exports = router;
