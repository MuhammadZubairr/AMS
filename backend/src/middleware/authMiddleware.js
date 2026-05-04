const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const { getClient } = require('../config/redis');

async function requireAuth(req, res, next) {
  const bearerToken = (req.headers.authorization || '').replace('Bearer ', '');
  const token = bearerToken || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);

    // If Redis is configured, ensure the session token is present (allows logout/invalidation)
    try {
      const redis = getClient();
      if (redis) {
        const exists = await redis.exists(`session:${token}`);
        if (!exists) {
          return res.status(401).json({ error: 'Session expired' });
        }
      }
    } catch (err) {
      // Non-fatal: if Redis check fails, allow token verification to continue
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };
