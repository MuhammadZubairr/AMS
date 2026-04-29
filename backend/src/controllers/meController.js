const db = require('../config/database');

function me(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({ user: req.user });
}

module.exports = { me };
