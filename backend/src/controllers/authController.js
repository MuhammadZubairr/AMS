const authService = require('../services/authService');

function durationToMs(value, fallbackMs) {
  const text = String(value || '').trim();
  if (!text) return fallbackMs;
  if (/^\d+$/.test(text)) return parseInt(text, 10) * 1000;

  const match = text.match(/^(\d+)\s*([smhd])$/i);
  if (!match) return fallbackMs;

  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return amount * (multipliers[unit] || 1000);
}

const ACCESS_COOKIE_MAX_AGE = durationToMs(process.env.JWT_EXPIRES_IN || '1h', 1000 * 60 * 60);
const REFRESH_COOKIE_MAX_AGE = durationToMs(process.env.REFRESH_JWT_EXPIRES_IN || '30d', 1000 * 60 * 60 * 24 * 30);

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.ip || req.connection?.remoteAddress;
    const { token, refreshToken, user } = await authService.login({ email, password, ip: clientIp });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    res.json({ token, refreshToken, user });
  } catch (error) {
    next(error);
  }
}

const { getClient } = require('../config/redis');

async function logout(req, res, next) {
  try {
    const bearerToken = (req.headers.authorization || '').replace('Bearer ', '');
    const token = bearerToken || req.cookies?.token;
    const refreshToken = req.cookies?.refreshToken;

    // Clear cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
    });

    // Invalidate session in Redis if present
    try {
      const redis = getClient();
      if (redis && token) {
        await redis.del(`session:${token}`);
      }
    } catch (err) {
      // non-fatal
    }

    await authService.revokeRefreshSession(refreshToken);

    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const { token, refreshToken: nextRefreshToken, user } = await authService.refreshSession(refreshToken);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });

    res.cookie('refreshToken', nextRefreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    res.json({ token, refreshToken: nextRefreshToken, user });
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const user = await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.json({ ok: true, message: 'Password changed successfully', user });
  } catch (error) {
    next(error);
  }
}

module.exports = { login, logout, refresh, changePassword };
