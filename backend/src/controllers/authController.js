const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { token, user } = await authService.login({ email, password });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
}

const { getClient } = require('../config/redis');

async function logout(req, res, next) {
  try {
    const bearerToken = (req.headers.authorization || '').replace('Bearer ', '');
    const token = bearerToken || req.cookies?.token;

    // Clear cookie
    res.clearCookie('token', {
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

    res.json({ message: 'Logout successful' });
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

module.exports = { login, logout, changePassword };
