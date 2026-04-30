/**
 * Notification Service
 * Handles sending notifications for various events
 */

const notificationModel = require('../models/notificationModel');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');

/**
 * Send late check-in notification
 * @param {number} userId - User ID
 * @param {Date} checkInTime - Check-in time
 */
async function sendLateCheckInNotification(userId, checkInTime) {
  try {
    await notificationModel.createLateCheckInNotification(userId, checkInTime);
    logger.info(`[Notification] Sent late check-in notification to user ${userId}`);
  } catch (error) {
    logger.error(`[Notification] Failed to send late check-in notification to user ${userId}:`, error);
  }
}

/**
 * Send leave status notification
 * @param {number} userId - User ID
 * @param {string} status - 'approved' or 'rejected'
 * @param {object} leaveDetails - Leave details
 */
async function sendLeaveStatusNotification(userId, status, leaveDetails) {
  try {
    await notificationModel.createLeaveStatusNotification(userId, status, leaveDetails);
    logger.info(`[Notification] Sent leave ${status} notification to user ${userId}`);
  } catch (error) {
    logger.error(`[Notification] Failed to send leave ${status} notification to user ${userId}:`, error);
  }
}

/**
 * Send attendance missing notification
 * @param {number} userId - User ID
 */
async function sendAttendanceMissingNotification(userId) {
  try {
    await notificationModel.createAttendanceMissingNotification(userId);
    logger.info(`[Notification] Sent attendance missing notification to user ${userId}`);
  } catch (error) {
    logger.error(`[Notification] Failed to send attendance missing notification to user ${userId}:`, error);
  }
}

/**
 * Send notification to department members (HR, Managers)
 * @param {string} department - 'hr' or 'manager'
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 * @param {number} relatedToId - Related entity ID
 * @param {string} relatedToType - Related entity type
 */
async function notifyDepartmentMembers(department, title, message, type, relatedToId = null, relatedToType = null) {
  try {
    const users = await userModel.getAllUsers({ role: department });

    for (const user of users.users) {
      await notificationModel.createNotification({
        user_id: user.id,
        title,
        message,
        type,
        related_to_id: relatedToId,
        related_to_type: relatedToType,
      });
    }

    logger.info(`[Notification] Sent ${type} notification to ${users.users.length} ${department} members`);
  } catch (error) {
    logger.error(`[Notification] Failed to send ${type} notification to ${department} members:`, error);
  }
}

module.exports = {
  sendLateCheckInNotification,
  sendLeaveStatusNotification,
  sendAttendanceMissingNotification,
  notifyDepartmentMembers,
};