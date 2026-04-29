const db = require('../config/database');

async function createUser({ email, passwordHash, name, role = 'employee' }) {
  const text = `
    INSERT INTO users (email, password_hash, name, role, created_at)
    VALUES ($1, $2, $3, $4, now())
    RETURNING id, email, name, role, created_at
  `;
  const { rows } = await db.query(text, [email, passwordHash, name, role]);
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await db.query(
    'SELECT id, email, password_hash, name, role, created_at FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return rows[0];
}

module.exports = { createUser, findByEmail };
