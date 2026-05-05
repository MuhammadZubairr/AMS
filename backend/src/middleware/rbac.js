/**
 * RBAC middleware helper
 * Usage: requireRole('admin') or requireRole(['admin','superadmin'])
 */
function requireRole(allowed) {
  const allowedList = Array.isArray(allowed) ? allowed : [allowed];

  return function (req, res, next) {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!allowedList.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

module.exports = { requireRole };
