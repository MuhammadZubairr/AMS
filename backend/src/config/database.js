const { Pool } = require('pg');

// Tune pool using environment variables for production readiness
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.PG_POOL_MAX || '20', 10),
  idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT_MS || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT_MS || '2000', 10),
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
