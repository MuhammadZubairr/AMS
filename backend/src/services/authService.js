const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '12', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

async function signup({ email, password, name }) {
  const existing = await userModel.findByEmail(email);
  if (existing) {
    const error = new Error('Email already registered');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userModel.createUser({ email, passwordHash, name });
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

async function login({ email, password }) {
  const user = await userModel.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { token, user: payload };
}

module.exports = { signup, login };
