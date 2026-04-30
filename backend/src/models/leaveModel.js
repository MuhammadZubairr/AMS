const db = require('../config/database');

/**
 * Create leave request
 */
async function createLeave({
  user_id,
  leave_type,
  start_date,
  end_date,
  reason,
}) {
  const query = `
    INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason, status, created_at)
    VALUES ($1, $2, $3, $4, $5, 'pending', now())
    RETURNING id, user_id, leave_type, start_date, end_date, reason, status, created_at
  `;

  const { rows } = await db.query(query, [
    user_id,
    leave_type,
    start_date,
    end_date,
    reason,
  ]);

  return rows[0];
}

/**
 * Get all pending leaves
 */
async function getPendingLeaves() {
  const query = `
    SELECT l.id, l.user_id, u.name, u.email, l.leave_type, l.start_date, l.end_date, l.reason, l.status, l.created_at
    FROM leaves l
    JOIN users u ON u.id = l.user_id
    WHERE l.status = 'pending'
    ORDER BY l.created_at DESC
  `;

  const { rows } = await db.query(query);
  return rows;
}

/**
 * Approve leave request
 */
async function approveLeave(leaveId, approvedBy) {
  const query = `
    UPDATE leaves
    SET status = 'approved', approved_by = $2, approved_at = now(), updated_at = now()
    WHERE id = $1
    RETURNING id, user_id, leave_type, start_date, end_date, status, approved_at
  `;

  const { rows } = await db.query(query, [leaveId, approvedBy]);
  return rows[0] || null;
}

/**
 * Reject leave request
 */
async function rejectLeave(leaveId, approvedBy) {
  const query = `
    UPDATE leaves
    SET status = 'rejected', approved_by = $2, approved_at = now(), updated_at = now()
    WHERE id = $1
    RETURNING id, user_id, leave_type, start_date, end_date, status, approved_at
  `;

  const { rows } = await db.query(query, [leaveId, approvedBy]);
  return rows[0] || null;
}

/**
 * Get leaves for employee
 */
async function getEmployeeLeaves(userId) {
  const query = `
    SELECT id, user_id, leave_type, start_date, end_date, reason, status, approved_at, created_at
    FROM leaves
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const { rows } = await db.query(query, [userId]);
  return rows;
}

/**
 * Get count of pending leaves
 */
async function getPendingLeavesCount() {
  const query = `
    SELECT COUNT(*) as count
    FROM leaves
    WHERE status = 'pending'
  `;

  const { rows } = await db.query(query);
  return parseInt(rows[0].count, 10);
}

module.exports = {
  createLeave,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
  getEmployeeLeaves,
  getPendingLeavesCount,
};
