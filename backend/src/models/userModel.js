const db = require('../config/database');
const ROLES = require('../constants/roles');

/**
 * Create a new user
 * @param {object} userData - User data
 * @param {string} userData.email - User email
 * @param {string} userData.passwordHash - Hashed password
 * @param {string} userData.name - User name
 * @param {string} userData.role - User role (default: 'employee')
 * @param {number} userData.createdBy - ID of user who created this user (optional)
 * @returns {Promise<object>} Created user object
 */
async function createUser({ email, passwordHash, name, role = ROLES.EMPLOYEE, createdBy = null }) {
  const text = `
    INSERT INTO users (email, password_hash, name, role, created_by, created_at)
    VALUES ($1, $2, $3, $4, $5, now())
    RETURNING id, email, name, role, created_by, created_at
  `;
  const { rows } = await db.query(text, [email, passwordHash, name, role, createdBy]);
  return rows[0];
}

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<object>} User object with password_hash
 */
async function findByEmail(email) {
  const { rows } = await db.query(
    'SELECT id, email, password_hash, name, role, created_by, created_at FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return rows[0];
}

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<object>} User object without password
 */
async function findById(id) {
  const { rows } = await db.query(
    'SELECT id, email, name, role, created_by, created_at FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0];
}

/**
 * Find user by ID including password hash
 * @param {number} id - User ID
 * @returns {Promise<object>} User object with password_hash
 */
async function findByIdWithPassword(id) {
  const { rows } = await db.query(
    'SELECT id, email, password_hash, name, role, created_by, created_at FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0];
}

/**
 * Count users by role
 * @param {string} role - User role to count
 * @returns {Promise<number>} Count of users with that role
 */
async function countByRole(role) {
  const { rows } = await db.query(
    'SELECT COUNT(*) as count FROM users WHERE role = $1',
    [role]
  );
  return parseInt(rows[0].count, 10);
}

/**
 * Count total users
 * @returns {Promise<number>} Total count of users
 */
async function countTotal() {
  const { rows } = await db.query('SELECT COUNT(*) as count FROM users');
  return parseInt(rows[0].count, 10);
}

/**
 * Get all users with pagination and search
 * @param {object} options - Query options
 * @param {number} options.limit - Number of results per page (default: 10)
 * @param {number} options.offset - Number of results to skip (default: 0)
 * @param {string} options.role - Filter by role (optional)
 * @param {string} options.search - Search by name or email (optional)
 * @returns {Promise<object>} { users: array, total: number }
 */
async function getAllUsers({ limit = 10, offset = 0, role = null, search = null } = {}) {
  let query = 'SELECT id, email, name, role, created_by, created_at FROM users';
  let countQuery = 'SELECT COUNT(*) as total FROM users';
  const params = [];
  const conditions = [];

  // Build WHERE conditions
  if (role) {
    conditions.push(`role = $${params.length + 1}`);
    params.push(role);
  }

  if (search) {
    conditions.push(`(LOWER(name) LIKE LOWER($${params.length + 1}) OR LOWER(email) LIKE LOWER($${params.length + 2}))`);
    params.push(`%${search}%`, `%${search}%`);
  }

  // Apply WHERE clause
  if (conditions.length > 0) {
    const whereClause = ' WHERE ' + conditions.join(' AND ');
    query += whereClause;
    countQuery += whereClause;
  }

  // Get total count
  const countParams = params.slice(0, conditions.length > 1 ? params.length - 2 : params.length);
  const { rows: countRows } = await db.query(countQuery, countParams);
  const total = parseInt(countRows[0].total, 10);

  // Add pagination
  query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const { rows } = await db.query(query, params);
  return { users: rows, total };
}

/**
 * Update user information
 * @param {number} id - User ID
 * @param {object} updates - Fields to update
 * @param {string} updates.name - User name (optional)
 * @param {string} updates.role - User role (optional)
 * @returns {Promise<object>} Updated user object
 */
async function updateUser(id, updates = {}) {
  const allowedFields = ['name', 'role'];
  const updateFields = [];
  const params = [id];
  let paramIndex = 2;

  // Build dynamic UPDATE query
  for (const field of allowedFields) {
    if (field in updates && updates[field] !== undefined) {
      updateFields.push(`${field} = $${paramIndex}`);
      params.push(updates[field]);
      paramIndex++;
    }
  }

  if (updateFields.length === 0) {
    const error = new Error('No valid fields to update');
    error.status = 400;
    throw error;
  }

  const text = `
    UPDATE users
    SET ${updateFields.join(', ')}
    WHERE id = $1
    RETURNING id, email, name, role, created_by, created_at
  `;

  const { rows } = await db.query(text, params);
  if (rows.length === 0) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  return rows[0];
}

/**
 * Update user password hash
 * @param {number} id - User ID
 * @param {string} passwordHash - New hashed password
 * @returns {Promise<object>} Updated user object
 */
async function updatePassword(id, passwordHash) {
  const { rows } = await db.query(
    `
      UPDATE users
      SET password_hash = $2
      WHERE id = $1
      RETURNING id, email, name, role, created_by, created_at
    `,
    [id, passwordHash]
  );

  if (rows.length === 0) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  return rows[0];
}

/**
 * Delete user by ID
 * @param {number} id - User ID to delete
 * @returns {Promise<object>} Success confirmation
 */
async function deleteUser(id) {
  const text = 'DELETE FROM users WHERE id = $1 RETURNING id';
  const { rows } = await db.query(text, [id]);
  
  if (rows.length === 0) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  
  return { id: rows[0].id, deleted: true };
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  findByIdWithPassword,
  countByRole,
  countTotal,
  getAllUsers,
  updateUser,
  updatePassword,
  deleteUser,
};
