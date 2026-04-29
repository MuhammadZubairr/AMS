const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const meRoutes = require('./routes/meRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/health', healthRoutes);
app.use('/api', meRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(JSON.stringify({ message: err.message || 'Internal error', path: req.path }));
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

module.exports = app;
