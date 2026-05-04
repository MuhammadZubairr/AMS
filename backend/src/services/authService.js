const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { validatePassword } = require('../utils/passwordValidator');
const logger = require('../utils/logger');
const ROLES = require('../constants/roles');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '12', 10);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV !== 'development') {
  logger.error('FATAL: Missing JWT_SECRET environment variable. Aborting startup.');
  process.exit(1);
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const { getClient } = require('../config/redis');

/**
 * Login user
 * @param {object} param0 - Login credentials
 * @returns {Promise<object>} Token and user object
 */
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

  // If Redis is available, cache the session token -> payload for quick validation and optional logout
  try {
    const redis = getClient();
    if (redis) {
      // Token TTL should match the JWT expiry as seconds when it's a simple duration like '1h'
      let ttl = 3600; // default 1 hour
      const match = String(JWT_EXPIRES_IN).match(/(\d+)h/);
      if (match) ttl = parseInt(match[1], 10) * 3600;
      await redis.set(`session:${token}`, JSON.stringify(payload), 'EX', ttl);
    }
  } catch (err) {
    logger.warn('Redis session set failed', err.message);
  }
  return { token, user: payload };
}

/**
 * Create user by admin
 * @param {object} param0 - User creation data
 * @param {number} createdBy - ID of admin creating this user
 * @returns {Promise<object>} Created user object
 */
async function createUserByAdmin({ email, password, name, role }, createdBy) {
  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    const error = new Error(passwordValidation.errors.join(', '));
    error.status = 400;
    throw error;
  }

  // Check if email already exists
  const existing = await userModel.findByEmail(email);
  if (existing) {
    const error = new Error('Email already registered');
    error.status = 409;
    throw error;
  }

  // Validate role using centralized constants
  const allowedRoles = [ROLES.MANAGER, ROLES.HR, ROLES.EMPLOYEE];
  if (!allowedRoles.includes(role)) {
    const error = new Error(`Invalid role. Allowed roles: ${allowedRoles.join(', ')}`);
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userModel.createUser({ 
    email, 
    passwordHash, 
    name, 
    role,
    createdBy
  });
  
  return { 
    id: user.id, 
    email: user.email, 
    name: user.name, 
    role: user.role,
    createdBy: user.created_by,
    createdAt: user.created_at
  };
}

/**
 * Change an authenticated user's password
 * @param {number} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<object>} Updated user object
 */
async function changePassword(userId, currentPassword, newPassword) {
  const user = await userModel.findByIdWithPassword(userId);

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  const currentPasswordMatches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!currentPasswordMatches) {
    const error = new Error('Current password is incorrect');
    error.status = 400;
    throw error;
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    const error = new Error(passwordValidation.errors.join(', '));
    error.status = 400;
    throw error;
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
  if (isSamePassword) {
    const error = new Error('New password must be different from the current password');
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const updatedUser = await userModel.updatePassword(userId, passwordHash);

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    role: updatedUser.role,
    created_by: updatedUser.created_by,
    created_at: updatedUser.created_at,
  };
}

module.exports = { login, createUserByAdmin, changePassword };
