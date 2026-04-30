/**
 * Role-Based Access Control Middleware
 * Restricts routes based on user role
 */

/**
 * Middleware to check if user has specific role(s)
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {function} Express middleware function
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Please login first' });
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden: You do not have permission to access this resource',
        userRole: req.user.role,
        requiredRoles: allowedRoles,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has any of the specified roles
 * @param {string[]} roles - Array of roles to check
 * @returns {function} Express middleware function
 */
function hasRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
}

module.exports = { requireRole, hasRole };
