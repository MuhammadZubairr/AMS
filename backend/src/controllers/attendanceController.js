/**
 * Employee Attendance Controller
 * Handles check-in and check-out with hybrid mode support (OFFICE/REMOTE)
 */

const attendanceModel = require('../models/attendanceModel');
const distanceService = require('../services/distanceService');
const notificationService = require('../services/notificationService');
const OFFICE_CONFIG = require('../config/officeConfig');

/**
 * Check if time is late (after 9:15 AM server time)
 * Uses Asia/Karachi timezone
 * @param {Date} date - Date/time to check
 * @returns {boolean} true if time is after 9:15 AM
 */
function isLateTime(date) {
  // Create a date in Asia/Karachi timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: OFFICE_CONFIG.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const hour = parseInt(parts.find((p) => p.type === 'hour').value, 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute').value, 10);

  const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  return timeString > OFFICE_CONFIG.lateTime; // '09:15'
}

/**
 * Check-in employee (marks attendance)
 * POST /api/attendance/check-in
 *
 * Request:
 * {
 *   "mode": "OFFICE|REMOTE",
 *   "latitude": 31.503586,     // required if OFFICE
 *   "longitude": 74.433875,    // required if OFFICE
 *   "device_id": "uuid",
 *   "device_name": "device",
 *   "ip_address": "192.168.1.1"
 * }
 */
async function checkIn(req, res, next) {
  try {
    const { mode, latitude, longitude, device_id, device_name, ip_address } = req.body;
    const userId = req.user.id;

    // Validate mode
    if (!mode || !['OFFICE', 'REMOTE'].includes(mode)) {
      const error = new Error('Invalid mode. Must be OFFICE or REMOTE');
      error.status = 400;
      throw error;
    }

    // Check if already checked in today
    const existingAttendance = await attendanceModel.getTodayAttendanceByUser(userId);
    if (existingAttendance && existingAttendance.check_in) {
      const error = new Error('You have already checked in today');
      error.status = 400;
      throw error;
    }

    let distanceInfo = null;

    // Validate GPS for OFFICE mode
    if (mode === 'OFFICE') {
      if (!latitude || !longitude) {
        const error = new Error('GPS coordinates required for OFFICE mode');
        error.status = 400;
        throw error;
      }

      // Calculate distance from office
      const geoValidation = distanceService.isWithinOfficeRange(
        latitude,
        longitude,
        OFFICE_CONFIG.latitude,
        OFFICE_CONFIG.longitude,
        OFFICE_CONFIG.radius
      );

      distanceInfo = {
        distance_from_office: `${geoValidation.distanceMeters} meters`,
        distance_value: geoValidation.distanceMeters,
        allowed_radius: `${OFFICE_CONFIG.radius} meters`,
      };

      if (!geoValidation.isInRange) {
        const error = new Error('You are not in office range');
        error.status = 400;
        error.data = {
          distance_from_office: geoValidation.distanceMeters,
          required_distance: OFFICE_CONFIG.radius,
          message: `You are ${geoValidation.distanceMeters - OFFICE_CONFIG.radius} meters outside the allowed range`,
        };
        throw error;
      }
    }

    // Determine status (present or late)
    const checkInTime = new Date();
    const status = isLateTime(checkInTime) ? 'late' : 'present';

    // Create check-in record
    const attendance = await attendanceModel.createCheckIn({
      user_id: userId,
      check_in: checkInTime,
      status,
      mode,
      latitude: mode === 'OFFICE' ? latitude : null,
      longitude: mode === 'OFFICE' ? longitude : null,
      device_id,
      device_name,
      ip_address,
    });

    // Send late check-in notification if applicable
    if (status === 'late') {
      notificationService.sendLateCheckInNotification(userId, checkInTime);
    }

    res.status(201).json({
      ok: true,
      message: 'Attendance marked successfully',
      data: {
        id: attendance.id,
        mode: attendance.mode,
        status: attendance.status,
        check_in: attendance.check_in,
        ...distanceInfo,
        device_name: attendance.device_name,
      },
    });
  } catch (error) {
    const response = {
      ok: false,
      error: error.message,
    };
    if (error.data) {
      response.data = error.data;
    }
    res.status(error.status || 500).json(response);
    next(error);
  }
}

/**
 * Check-out employee
 * POST /api/attendance/check-out
 *
 * Request:
 * {
 *   "mode": "OFFICE|REMOTE",
 *   "latitude": 31.503586,     // required if OFFICE
 *   "longitude": 74.433875,    // required if OFFICE
 *   "device_id": "uuid",
 *   "device_name": "device",
 *   "ip_address": "192.168.1.1"
 * }
 */
async function checkOut(req, res, next) {
  try {
    const { mode, latitude, longitude, device_id, device_name, ip_address } = req.body;
    const userId = req.user.id;

    // Validate mode
    if (!mode || !['OFFICE', 'REMOTE'].includes(mode)) {
      const error = new Error('Invalid mode. Must be OFFICE or REMOTE');
      error.status = 400;
      throw error;
    }

    // Get today's attendance record
    const attendance = await attendanceModel.getTodayAttendanceByUser(userId);
    if (!attendance) {
      const error = new Error('No check-in record found for today');
      error.status = 404;
      throw error;
    }

    if (attendance.check_out) {
      const error = new Error('You have already checked out today');
      error.status = 400;
      throw error;
    }

    let distanceInfo = null;

    // Validate GPS for OFFICE mode
    if (mode === 'OFFICE') {
      if (!latitude || !longitude) {
        const error = new Error('GPS coordinates required for OFFICE mode');
        error.status = 400;
        throw error;
      }

      // Calculate distance from office
      const geoValidation = distanceService.isWithinOfficeRange(
        latitude,
        longitude,
        OFFICE_CONFIG.latitude,
        OFFICE_CONFIG.longitude,
        OFFICE_CONFIG.radius
      );

      distanceInfo = {
        distance_from_office: `${geoValidation.distanceMeters} meters`,
        distance_value: geoValidation.distanceMeters,
        allowed_radius: `${OFFICE_CONFIG.radius} meters`,
      };

      if (!geoValidation.isInRange) {
        const error = new Error('You are not in office range for check-out');
        error.status = 400;
        error.data = {
          distance_from_office: geoValidation.distanceMeters,
          required_distance: OFFICE_CONFIG.radius,
          message: `You are ${geoValidation.distanceMeters - OFFICE_CONFIG.radius} meters outside the allowed range`,
        };
        throw error;
      }
    }

    // Update check-out record
    const checkOutTime = new Date();
    const updatedAttendance = await attendanceModel.updateCheckOut(attendance.id, {
      check_out: checkOutTime,
      mode,
      latitude: mode === 'OFFICE' ? latitude : null,
      longitude: mode === 'OFFICE' ? longitude : null,
      device_id,
      device_name,
      ip_address,
    });

    res.json({
      ok: true,
      message: 'Check-out recorded successfully',
      data: {
        id: updatedAttendance.id,
        mode: updatedAttendance.mode,
        status: updatedAttendance.status,
        check_in: updatedAttendance.check_in,
        check_out: updatedAttendance.check_out,
        working_seconds: updatedAttendance.working_seconds,
        ...distanceInfo,
        device_name: updatedAttendance.device_name,
      },
    });
  } catch (error) {
    const response = {
      ok: false,
      error: error.message,
    };
    if (error.data) {
      response.data = error.data;
    }
    res.status(error.status || 500).json(response);
    next(error);
  }
}

/**
 * Get today's attendance status for the current user
 * GET /api/attendance/today
 */
async function getMyAttendanceSummary(req, res, next) {
  try {
    const userId = req.user.id;
    const summary = await attendanceModel.getAttendanceSummaryByUser(userId);
    const history = await attendanceModel.getAttendanceHistoryByUser(userId, { limit: 10, offset: 0 });

    res.json({
      ok: true,
      data: {
        summary,
        history: history.records,
        total_records: history.total,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getTodayStatus(req, res, next) {
  try {
    const userId = req.user.id;
    const attendance = await attendanceModel.getTodayAttendanceByUser(userId);

    if (!attendance) {
      return res.json({
        ok: true,
        data: {
          checked_in: false,
          checked_out: false,
        },
      });
    }

    res.json({
      ok: true,
      data: {
        checked_in: !!attendance.check_in,
        checked_out: !!attendance.check_out,
        mode: attendance.mode,
        status: attendance.status,
        check_in: attendance.check_in,
        check_out: attendance.check_out,
        device_name: attendance.device_name,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get attendance history for current employee
 * GET /api/attendance/history?limit=30&offset=0
 */
async function getMyAttendanceHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 30;
    const offset = parseInt(req.query.offset, 10) || 0;
    const from = req.query.from || null; // YYYY-MM-DD
    const to = req.query.to || null; // YYYY-MM-DD
    const status = req.query.status || null; // present|absent|late
    const workType = req.query.workType || null; // OFFICE|REMOTE
    const month = req.query.month || null; // YYYY-MM

    const history = await attendanceModel.getAttendanceHistoryByUser(userId, {
      limit,
      offset,
      from,
      to,
      status,
      workType,
    });

    // If month provided, fetch monthly stats
    let stats = null;
    if (month) {
      const [year, monthNum] = month.split('-').map((v) => parseInt(v, 10));
      if (!Number.isNaN(year) && !Number.isNaN(monthNum)) {
        stats = await attendanceModel.getAttendanceSummaryByUser(userId, { year, month: monthNum });
      }
    }

    res.json({
      ok: true,
      data: {
        history,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkIn,
  checkOut,
  getMyAttendanceSummary,
  getTodayStatus,
  getMyAttendanceHistory,
};
