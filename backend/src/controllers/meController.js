const db = require('../config/database');
const userModel = require('../models/userModel');

async function me(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    if (!name && !email) {
      const error = new Error('At least one field must be provided to update');
      error.status = 400;
      throw error;
    }

    if (email) {
      const existing = await userModel.findByEmail(email);
      if (existing && existing.id !== userId) {
        const error = new Error('Email is already in use');
        error.status = 409;
        throw error;
      }
    }

    const updated = await userModel.updateUser(userId, {
      name: name || undefined,
      email: email || undefined,
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
}

module.exports = { me, updateProfile };
