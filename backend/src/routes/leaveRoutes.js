/**
 * Leave Routes
 * Routes for employees to request and review their own leaves
 */

const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const leaveController = require('../controllers/leaveController');

const router = express.Router();

router.use(requireAuth);

router.post('/', leaveController.requestLeave);
router.get('/', leaveController.getMyLeaves);

module.exports = router;
