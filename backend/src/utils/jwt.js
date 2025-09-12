const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';

function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

module.exports = { signAccessToken, verifyAccessToken };
