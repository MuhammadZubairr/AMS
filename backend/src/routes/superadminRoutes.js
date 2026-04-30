/**
 * Super Admin Routes
 * Routes for super admin dashboard and user management
 * All routes require superadmin role
 */

const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const superadminController = require('../controllers/superadminController');

const router = express.Router();

// All superadmin routes require authentication and superadmin role
router.use(requireAuth);
router.use(requireRole('superadmin'));

/**
 * GET /api/superadmin/dashboard
 * Get dashboard statistics (user counts, breakdown by role)
 */
router.get('/dashboard', superadminController.getDashboard);

/**
 * GET /api/superadmin/users
 * Get all users with optional filtering by role
 * Query params: role, limit, offset
 */
router.get('/users', superadminController.getUsers);

/**
 * GET /api/superadmin/users/:userId
 * Get specific user details
 */
router.get('/users/:userId', superadminController.getUserDetails);

/**
 * POST /api/superadmin/create-manager
 * Create a new manager account
 * Body: { name, email, password }
 */
router.post('/create-manager', superadminController.createManager);

/**
 * POST /api/superadmin/create-hr
 * Create a new HR user account
 * Body: { name, email, password }
 */
router.post('/create-hr', superadminController.createHr);

/**
 * POST /api/superadmin/create-user
 * Create a user with any allowed role (manager|hr|employee)
 * Body: { name, email, password, role }
 */
router.post('/create-user', superadminController.createUser);

/**
 * POST /api/superadmin/verify-password
 * Verify if password meets requirements
 * Body: { password }
 * Useful for frontend validation feedback
 */
router.post('/verify-password', superadminController.verifyPassword);

/**
 * PUT /api/superadmin/users/:id
 * Update user role or name
 * Body: { role, name }
 * Allowed roles: superadmin, manager, hr, employee
 */
router.put('/users/:id', superadminController.updateUserRole);

/**
 * DELETE /api/superadmin/users/:id
 * Delete a user account
 * Safety rule: Cannot delete another superadmin
 */
router.delete('/users/:id', superadminController.deleteUser);

/**
 * GET /api/superadmin/managers
 * Get all managers with optional search and pagination
 * Query params: search, limit, offset
 */
router.get('/managers', superadminController.getManagers);

/**
 * PUT /api/superadmin/managers/:id
 * Update manager details (name, email)
 * Body: { name, email }
 */
router.put('/managers/:id', superadminController.updateManager);

/**
 * GET /api/superadmin/hr
 * Get all HR users with optional search and pagination
 * Query params: search, limit, offset
 */
router.get('/hr', superadminController.getHR);

/**
 * PUT /api/superadmin/hr/:id
 * Update HR user details (name, email)
 * Body: { name, email }
 */
router.put('/hr/:id', superadminController.updateHR);

/**
 * GET /api/superadmin/today-attendance
 * Query param: period=today|weekly|monthly
 */
router.get('/today-attendance', superadminController.getAttendance);

module.exports = router;
