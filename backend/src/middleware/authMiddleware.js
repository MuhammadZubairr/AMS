const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function requireAuth(req, res, next) {
  const token = req.cookies?.token || (req.headers.authorization || '').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };
