/**
 * Manager Routes
 * Routes for manager-specific operations
 */

const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');

// All manager routes require authentication and manager role
router.use(requireAuth);
router.use(requireRole(ROLES.MANAGER));

// Dashboard
router.get('/dashboard', managerController.getDashboard);

// Team management
router.get('/team', managerController.getTeam);

// Team attendance
router.get('/team-attendance', managerController.getTeamAttendance);

// Leave requests
router.get('/leave-requests', managerController.getLeaveRequests);
router.post('/leaves/:id/approve', managerController.approveLeave);
router.post('/leaves/:id/reject', managerController.rejectLeave);

// Reports
router.get('/reports', managerController.getReports);

module.exports = router;