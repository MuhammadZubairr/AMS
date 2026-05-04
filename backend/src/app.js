const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');

const { initRedis } = require('./config/redis');

const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const meRoutes = require('./routes/meRoutes');
const superadminRoutes = require('./routes/superadminRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const hrRoutes = require('./routes/hrRoutes');
const managerRoutes = require('./routes/managerRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();
const logger = require('./utils/logger');

// Initialize Redis client if configured (used for session caching and dashboard caching)
initRedis();

// Security and compression
app.use(helmet());
app.use(compression({ threshold: 1024 }));

// Limit payload size to avoid accidental large requests
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Lightweight response-time header using high-resolution timer
app.use((req, res, next) => {
  const start = process.hrtime();
  res.once('finish', () => {
    const delta = process.hrtime(start);
    const ms = Math.round(delta[0] * 1000 + delta[1] / 1e6);
    // Cannot modify headers after response is finished; log the response time instead.
    try {
      logger.info(`Response time: ${ms}ms - ${req.method} ${req.path}`);
    } catch (e) {
      // ignore logging errors
    }
  });
  next();
});
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/health', healthRoutes);
app.use('/api', meRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/leaves', leaveRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  const userId = req.user && req.user.id ? req.user.id : null;
  logger.error(JSON.stringify({ message: err.message || 'Internal error', path: req.path, userId }));
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

module.exports = app;
