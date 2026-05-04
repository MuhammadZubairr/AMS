/**
 * HR Routes
 * Routes for HR users to manage employees, attendance, and leaves
 * All routes require authentication and HR role
 */

const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');
const hrController = require('../controllers/hrController');

const router = express.Router();

// All HR routes require authentication and HR role
router.use(requireAuth);
router.use(requireRole(ROLES.HR));

/**
 * Dashboard
 */
router.get('/dashboard', hrController.getDashboard);

/**
 * Employees Management
 */
router.get('/employees', hrController.getEmployees);
router.get('/employees/:id', hrController.getEmployee);
router.post('/employees', hrController.createEmployee);
router.put('/employees/:id', hrController.updateEmployee);
router.delete('/employees/:id', hrController.deleteEmployee);

/**
 * Attendance Viewing
 */
router.get('/attendance', hrController.getAttendance);
router.get('/attendance/stats', hrController.getAttendanceStats);

/**
 * Reports
 */
router.get('/reports/daily', hrController.getDailyReport);
router.get('/reports/monthly', hrController.getMonthlyReport);
router.get('/reports/employee/:id', hrController.getEmployeeReport);

/**
 * Leave Management
 */
router.get('/leaves/pending', hrController.getPendingLeaves);
router.post('/leaves/:id/approve', hrController.approveLeave);
router.post('/leaves/:id/reject', hrController.rejectLeave);

module.exports = router;
