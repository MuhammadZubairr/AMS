const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const ROLES = require('../constants/roles');
const reportsController = require('../controllers/reportsController');

const router = express.Router();

// All reports endpoints require auth and superadmin role
router.use(requireAuth);
router.use(requireRole(ROLES.SUPERADMIN));

// GET /api/reports/daily?date=YYYY-MM-DD
router.get('/daily', reportsController.dailyReport);

// GET /api/reports/monthly?year=YYYY&month=MM
router.get('/monthly', reportsController.monthlyReport);

// GET /api/reports/employee/:id
router.get('/employee/:id', reportsController.employeeReport);

module.exports = router;
