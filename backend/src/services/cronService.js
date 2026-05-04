/**
 * Cron Job Service
 * Handles scheduled tasks for the application
 */

const cron = require('node-cron');
const attendanceModel = require('../models/attendanceModel');
const userModel = require('../models/userModel');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

/**
 * Mark employees as absent who haven't checked in by end of day
 * Runs every day at 6:00 PM (18:00)
 */
async function markAbsentEmployees() {
  try {
    logger.info('[Cron] Starting daily absent marking job');

    // Get all employees
    const ROLES = require('../constants/roles');
    const employees = await userModel.getAllUsers({ role: ROLES.EMPLOYEE });

    let absentCount = 0;

    for (const employee of employees.users) {
      // Check if employee has attendance record for today
      const todayAttendance = await attendanceModel.getTodayAttendanceByUser(employee.id);

      if (!todayAttendance) {
        // No attendance record for today, mark as absent
        await attendanceModel.createAbsentRecord(employee.id);
        await notificationService.sendAttendanceMissingNotification(employee.id);
        absentCount++;
        logger.info(`[Cron] Marked employee ${employee.name} (${employee.email}) as absent`);
      }
    }

    logger.info(`[Cron] Completed absent marking job. Marked ${absentCount} employees as absent`);
  } catch (error) {
    logger.error('[Cron] Error in markAbsentEmployees:', error);
  }
}

/**
 * Initialize all cron jobs
 */
function initializeCronJobs() {
  logger.info('[Cron] Initializing cron jobs');

  // Mark absent employees every day at 6:00 PM
  cron.schedule('0 18 * * *', markAbsentEmployees, {
    timezone: 'Asia/Karachi'
  });

  logger.info('[Cron] Cron jobs initialized successfully');
}

module.exports = {
  initializeCronJobs,
  markAbsentEmployees, // Export for testing
};