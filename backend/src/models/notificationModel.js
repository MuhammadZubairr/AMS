/**
 * Notification Model
 * Handles notification creation and retrieval
 */

const db = require('../config/database');

/**
 * Create a notification
 * @param {object} data - Notification data
 * @returns {Promise<object>} Created notification
 */
async function createNotification({
  user_id,
  title,
  message,
  type,
  related_to_id = null,
  related_to_type = null,
}) {
  const query = `
    INSERT INTO notifications (user_id, title, message, type, related_to_id, related_to_type, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, now())
    RETURNING id, user_id, title, message, type, related_to_id, related_to_type, is_read, created_at
  `;

  const { rows } = await db.query(query, [
    user_id,
    title,
    message,
    type,
    related_to_id,
    related_to_type,
  ]);

  return rows[0];
}

/**
 * Get notifications for a user
 * @param {number} userId - User ID
 * @param {object} options - Pagination options
 * @returns {Promise<object>} Notifications and count
 */
async function getUserNotifications(userId, { limit = 20, offset = 0 } = {}) {
  const countQuery = `
    SELECT COUNT(*)::INTEGER AS total
    FROM notifications
    WHERE user_id = $1
  `;

  const dataQuery = `
    SELECT id, title, message, type, related_to_id, related_to_type, is_read, created_at
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const [countResult, dataResult] = await Promise.all([
    db.query(countQuery, [userId]),
    db.query(dataQuery, [userId, limit, offset]),
  ]);

  return {
    total: countResult.rows[0].total,
    notifications: dataResult.rows,
  };
}

/**
 * Mark notification as read
 * @param {number} notificationId - Notification ID
 * @param {number} userId - User ID (for security)
 * @returns {Promise<boolean>} Success status
 */
async function markAsRead(notificationId, userId) {
  const query = `
    UPDATE notifications
    SET is_read = true, read_at = now()
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;

  const { rows } = await db.query(query, [notificationId, userId]);
  return rows.length > 0;
}

/**
 * Get unread count for user
 * @param {number} userId - User ID
 * @returns {Promise<number>} Unread count
 */
async function getUnreadCount(userId) {
  const query = `
    SELECT COUNT(*)::INTEGER AS count
    FROM notifications
    WHERE user_id = $1 AND is_read = false
  `;

  const { rows } = await db.query(query, [userId]);
  return rows[0].count;
}

/**
 * Create late check-in notification
 * @param {number} userId - User ID
 * @param {Date} checkInTime - Check-in time
 * @returns {Promise<object>} Created notification
 */
async function createLateCheckInNotification(userId, checkInTime) {
  const title = 'Late Check-in Alert';
  const message = `You checked in late at ${checkInTime.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Karachi',
    hour12: true
  })}. Please ensure timely attendance.`;

  return await createNotification({
    user_id: userId,
    title,
    message,
    type: 'late_checkin',
  });
}

/**
 * Create leave approval notification
 * @param {number} userId - User ID
 * @param {string} status - 'approved' or 'rejected'
 * @param {object} leaveDetails - Leave details
 * @returns {Promise<object>} Created notification
 */
async function createLeaveStatusNotification(userId, status, leaveDetails) {
  const title = status === 'approved' ? 'Leave Approved' : 'Leave Rejected';
  const message = `Your leave request from ${leaveDetails.start_date} to ${leaveDetails.end_date} has been ${status}.`;

  return await createNotification({
    user_id: userId,
    title,
    message,
    type: 'leave_status',
    related_to_id: leaveDetails.id,
    related_to_type: 'leave',
  });
}

/**
 * Create attendance missing notification
 * @param {number} userId - User ID
 * @returns {Promise<object>} Created notification
 */
async function createAttendanceMissingNotification(userId) {
  const title = 'Attendance Missing';
  const message = 'You have been marked as absent today. Please check-in if you are present.';

  return await createNotification({
    user_id: userId,
    title,
    message,
    type: 'attendance_missing',
  });
}

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  getUnreadCount,
  createLateCheckInNotification,
  createLeaveStatusNotification,
  createAttendanceMissingNotification,
};