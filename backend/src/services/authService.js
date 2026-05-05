const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET || `${JWT_SECRET || 'dev'}_refresh`;
const REFRESH_JWT_EXPIRES_IN = process.env.REFRESH_JWT_EXPIRES_IN || '30d';
const { getClient } = require('../config/redis');

/**
 * Login user
 * @param {object} param0 - Login credentials
 * @returns {Promise<object>} Token and user object
 */
const MAX_FAILED_ATTEMPTS = parseInt(process.env.MAX_FAILED_ATTEMPTS || '5', 10);
const LOCK_DURATION_SECONDS = parseInt(process.env.ACCOUNT_LOCK_SECONDS || String(15 * 60), 10); // default 15 minutes

function parseDurationToSeconds(value, fallbackSeconds) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const text = String(value || '').trim();
  if (!text) return fallbackSeconds;
  if (/^\d+$/.test(text)) return parseInt(text, 10);

  const match = text.match(/^(\d+)\s*([smhd])$/i);
  if (!match) return fallbackSeconds;

  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
  return amount * (multipliers[unit] || 1);
}

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function signRefreshToken(payload) {
  return jwt.sign({ ...payload, jti: crypto.randomUUID() }, REFRESH_JWT_SECRET, {
    expiresIn: REFRESH_JWT_EXPIRES_IN,
  });
}

async function storeRefreshSession(redis, refreshToken, payload) {
  if (!redis) return;

  const decoded = jwt.decode(refreshToken);
  if (!decoded || !decoded.jti) return;

  const ttl = parseDurationToSeconds(REFRESH_JWT_EXPIRES_IN, 30 * 24 * 3600);
  await redis.set(
    `refresh:${decoded.jti}`,
    JSON.stringify({
      userId: payload.id,
      email: payload.email,
      role: payload.role,
    }),
    'EX',
    ttl
  );
}

async function login({ email, password, ip = null }) {
  const redis = (() => {
    try {
      return getClient();
    } catch (e) {
      return null;
    }
  })();

  const normalizedEmail = String(email || '').toLowerCase();
  const failedKey = `login:failed:${normalizedEmail}`;
  const lockKey = `login:locked:${normalizedEmail}`;

  // Check lockout
  try {
    if (redis) {
      const isLocked = await redis.get(lockKey);
      if (isLocked) {
        const error = new Error('Account locked due to multiple failed login attempts. Try again later.');
        error.status = 423;
        throw error;
      }
    }
  } catch (e) {
    // Non-fatal - continue but log
    logger.warn('Redis check for lock failed', e.message);
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    // record failed attempt and audit
    try {
      if (redis) {
        const attempts = await redis.incr(failedKey);
        if (attempts === 1) await redis.expire(failedKey, LOCK_DURATION_SECONDS);
        if (attempts >= MAX_FAILED_ATTEMPTS) {
          await redis.set(lockKey, '1', 'EX', LOCK_DURATION_SECONDS);
        }
        await redis.lpush('audit:login', JSON.stringify({ email: normalizedEmail, ip, success: false, reason: 'user_not_found', timestamp: new Date().toISOString(), attempts }));
      } else {
        logger.info({ email: normalizedEmail, ip, success: false, reason: 'user_not_found' }, 'Login attempt');
      }
    } catch (err) {
      logger.warn('Failed to record failed login attempt', err.message);
    }

    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    // increment failed attempts and possibly lock
    try {
      if (redis) {
        const attempts = await redis.incr(failedKey);
        if (attempts === 1) await redis.expire(failedKey, LOCK_DURATION_SECONDS);
        if (attempts >= MAX_FAILED_ATTEMPTS) {
          await redis.set(lockKey, '1', 'EX', LOCK_DURATION_SECONDS);
        }
        await redis.lpush('audit:login', JSON.stringify({ email: normalizedEmail, ip, success: false, reason: 'invalid_password', timestamp: new Date().toISOString(), attempts, role: user.role }));
      } else {
        logger.info({ email: normalizedEmail, ip, success: false, reason: 'invalid_password', role: user.role }, 'Login attempt');
      }
    } catch (err) {
      logger.warn('Failed to record failed login attempt', err.message);
    }

    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const payload = { id: user.id, email: user.email, role: user.role };
  const token = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Successful login: clear failed counters and record audit
  try {
    if (redis) {
      await redis.del(failedKey);
      await redis.del(lockKey);
      await redis.lpush('audit:login', JSON.stringify({ email: normalizedEmail, ip, success: true, reason: 'ok', timestamp: new Date().toISOString(), role: user.role }));
    } else {
      logger.info({ email: normalizedEmail, ip, success: true, role: user.role }, 'Login successful');
    }
  } catch (err) {
    logger.warn('Failed to record successful login', err.message);
  }

  // If Redis is available, cache the session token -> payload for quick validation and optional logout
  try {
    if (redis) {
      // Token TTL should match the JWT expiry as seconds when it's a simple duration like '1h'
      let ttl = 3600; // default 1 hour
      const match = String(JWT_EXPIRES_IN).match(/(\d+)h/);
      if (match) ttl = parseInt(match[1], 10) * 3600;
      await redis.set(`session:${token}`, JSON.stringify(payload), 'EX', ttl);
      await storeRefreshSession(redis, refreshToken, payload);
    }
  } catch (err) {
    logger.warn('Redis session set failed', err.message);
  }
  return { token, refreshToken, user: payload };
}

/**
 * Refresh an existing session using a refresh token
 * @param {string} refreshToken - Refresh token from cookie
 * @returns {Promise<object>} New tokens and user payload
 */
async function refreshSession(refreshToken) {
  if (!refreshToken) {
    const error = new Error('Session expired');
    error.status = 401;
    throw error;
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_JWT_SECRET);
  } catch (error) {
    const sessionError = new Error('Session expired');
    sessionError.status = 401;
    throw sessionError;
  }

  const redis = (() => {
    try {
      return getClient();
    } catch (e) {
      return null;
    }
  })();

  if (redis) {
    const record = await redis.get(`refresh:${payload.jti}`);
    if (!record) {
      const error = new Error('Session expired');
      error.status = 401;
      throw error;
    }

    await redis.del(`refresh:${payload.jti}`);
  }

  const userPayload = { id: payload.id, email: payload.email, role: payload.role };
  const token = signAccessToken(userPayload);
  const nextRefreshToken = signRefreshToken(userPayload);

  try {
    if (redis) {
      let ttl = 3600;
      const match = String(JWT_EXPIRES_IN).match(/(\d+)h/);
      if (match) ttl = parseInt(match[1], 10) * 3600;
      await redis.set(`session:${token}`, JSON.stringify(userPayload), 'EX', ttl);
      await storeRefreshSession(redis, nextRefreshToken, userPayload);
    }
  } catch (err) {
    logger.warn('Redis refresh session set failed', err.message);
  }

  return { token, refreshToken: nextRefreshToken, user: userPayload };
}

/**
 * Revoke refresh token session if present
 * @param {string} refreshToken - refresh token to revoke
 */
async function revokeRefreshSession(refreshToken) {
  if (!refreshToken) return;

  try {
    const payload = jwt.verify(refreshToken, REFRESH_JWT_SECRET);
    const redis = (() => {
      try {
        return getClient();
      } catch (e) {
        return null;
      }
    })();

    if (redis && payload?.jti) {
      await redis.del(`refresh:${payload.jti}`);
    }
  } catch (error) {
    // ignore invalid refresh token during logout
  }
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

module.exports = { login, refreshSession, revokeRefreshSession, createUserByAdmin, changePassword };
