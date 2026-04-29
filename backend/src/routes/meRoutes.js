const express = require('express');

const meController = require('../controllers/meController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/auth/me', requireAuth, meController.me);

module.exports = router;
