const authService = require('../services/authService');

async function signup(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const user = await authService.signup({ email, password, name });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

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

    res.json({ user });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
    });
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, login, logout };
