/**
 * Employee Attendance Routes
 * Routes for employees to check-in and check-out
 * All routes require authentication
 */

const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

// All attendance routes require authentication
router.use(requireAuth);

/**
 * POST /api/attendance/check-in
 * Employee checks in with mode selection (OFFICE/REMOTE)
 * If OFFICE: requires GPS coordinates
 */
router.post('/check-in', attendanceController.checkIn);

/**
 * POST /api/attendance/check-out
 * Employee checks out with mode selection (OFFICE/REMOTE)
 * If OFFICE: requires GPS coordinates
 */
router.post('/check-out', attendanceController.checkOut);

router.get('/summary', attendanceController.getMyAttendanceSummary);

/**
 * GET /api/attendance/today
 * Get today's attendance status for current user
 * Returns: checked_in, checked_out, mode, status, check_in time, check_out time
 */
router.get('/today', attendanceController.getTodayStatus);

/**
 * GET /api/attendance/history
 * Get attendance history for current employee
 */
router.get('/history', attendanceController.getMyAttendanceHistory);

module.exports = router;
