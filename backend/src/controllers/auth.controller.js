const bcrypt = require('bcryptjs');
const { signAccessToken } = require('../utils/jwt');
const { findByEmail, createUser,  findWithPasswordById, // <—
  anonymizeUser } = require('../models/user.model');

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: String(process.env.COOKIE_SECURE).toLowerCase() === 'true',
  path: '/',
  maxAge: 1000 * 60 * 15, // 15 minuti, allineato a JWT_ACCESS_EXPIRES
};

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.validated;

    const exists = await findByEmail(email);
    if (exists) {
      const err = new Error('Email already in use');
      err.status = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash, role: 'customer' });

    const token = signAccessToken({ sub: String(user.id), role: user.role });

    // Opzione 1: token nel body (semplice)
    // Opzione 2: anche cookie httpOnly (comodo per frontend)
    res
      .cookie('access_token', token, COOKIE_OPTIONS)
      .status(201)
      .json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token
      });
  } catch (err) {
    return next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.validated;

    const user = await findByEmail(email);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }

    const token = signAccessToken({ sub: String(user.id), role: user.role });

    res
      .cookie('access_token', token, COOKIE_OPTIONS)
      .json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token
      });
  } catch (err) {
    return next(err);
  }
}

// POST /api/auth/logout
async function logout(req, res, next) {
  try {
    res.clearCookie('access_token', { path: '/' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  // req.user è popolato da requireAuth
  res.json({ user: req.user });
}

async function deleteMe(req, res, next) {
  try {
    const userId = parseInt(req.user.id, 10);
    const { password } = req.validated;

    const user = await findWithPasswordById(userId);
    if (!user) {
      const e = new Error('User not found');
      e.status = 404;
      throw e;
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      const e = new Error('Invalid password');
      e.status = 401;
      throw e;
    }

    // Se vuoi bloccare gli admin dall'autocancellarsi, inserisci qui un check su user.role

    // random hash per “disattivare” l’account
    const randomHash = await bcrypt.hash(`${user.id}:${Date.now()}:${Math.random()}`, 10);
    await anonymizeUser(user.id, randomHash);

    res.clearCookie('access_token', { path: '/' });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, me, deleteMe };
