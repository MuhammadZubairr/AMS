const db = require('../config/database');
const ROLES = require('../constants/roles');

/**
 * Get all employees (for HR to manage)
 */
async function getAllEmployees({ limit = 10, offset = 0, search = null } = {}) {
  let query = 'SELECT id, email, name, role, created_at FROM users WHERE role = $1';
  let countQuery = 'SELECT COUNT(*) as total FROM users WHERE role = $1';
  const params = [ROLES.EMPLOYEE];

  if (search) {
    query += ` AND (LOWER(name) LIKE LOWER($2) OR LOWER(email) LIKE LOWER($2))`;
    countQuery += ` AND (LOWER(name) LIKE LOWER($2) OR LOWER(email) LIKE LOWER($2))`;
    params.push(`%${search}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  const countResult = await db.query(countQuery, [ROLES.EMPLOYEE]);
  const result = await db.query(query, [...params, limit, offset]);

  return {
    employees: result.rows,
    total: parseInt(countResult.rows[0].total, 10),
  };
}

/**
 * Get dashboard stats for HR
 */
async function getDashboardStats() {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = $1) as total_employees,
      (SELECT COUNT(DISTINCT user_id) FROM attendance WHERE DATE(created_at) = CURRENT_DATE AND status = 'PRESENT') as present_today,
      (SELECT COUNT(DISTINCT user_id) FROM attendance WHERE DATE(created_at) = CURRENT_DATE AND status = 'ABSENT') as absent_today,
      (SELECT COUNT(DISTINCT user_id) FROM attendance WHERE DATE(created_at) = CURRENT_DATE AND status = 'LATE') as late_today,
      (SELECT COUNT(*) FROM leaves WHERE status = 'pending') as pending_leaves
  `;

  const { rows } = await db.query(query, [ROLES.EMPLOYEE]);
  return rows[0];
}

/**
 * Create new employee
 */
async function createEmployee(email, passwordHash, name) {
  const query = `
    INSERT INTO users (email, password_hash, name, role, created_at)
    VALUES ($1, $2, $3, $4, now())
    RETURNING id, email, name, role, created_at
  `;

  const { rows } = await db.query(query, [email, passwordHash, name, ROLES.EMPLOYEE]);
  return rows[0];
}

/**
 * Get employee details
 */
async function getEmployeeById(id) {
  const query = 'SELECT id, email, name, role, created_at FROM users WHERE id = $1 AND role = $2';
  const { rows } = await db.query(query, [id, ROLES.EMPLOYEE]);
  return rows[0] || null;
}

/**
 * Update employee
 */
async function updateEmployee(id, { name, email }) {
  const query = `
    UPDATE users
    SET name = COALESCE($2, name), email = COALESCE($3, email), updated_at = now()
    WHERE id = $1 AND role = $4
    RETURNING id, email, name, role, created_at
  `;

  const { rows } = await db.query(query, [id, name || null, email || null, ROLES.EMPLOYEE]);
  return rows[0] || null;
}

/**
 * Delete employee
 */
async function deleteEmployee(id) {
  const query = 'DELETE FROM users WHERE id = $1 AND role = $2 RETURNING id';
  const { rows } = await db.query(query, [id, ROLES.EMPLOYEE]);
  return rows[0] || null;
}

module.exports = {
  getAllEmployees,
  getDashboardStats,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
