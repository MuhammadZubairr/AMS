/**
 * Manager Controller
 * Handles manager-specific operations: team management, attendance viewing, leave approvals
 */

const userModel = require('../models/userModel');
const attendanceModel = require('../models/attendanceModel');
const leaveModel = require('../models/leaveModel');
const reportModel = require('../models/reportModel');
const notificationService = require('../services/notificationService');

/**
 * Get manager dashboard statistics
 * GET /api/manager/dashboard
 */
async function getDashboard(req, res, next) {
  try {
    // For now, managers can see all employees. In production, you'd filter by manager_id
    const [totalTeamMembers, presentToday, absentToday, lateToday, pendingLeaves] = await Promise.all([
      userModel.countByRole('employee'),
      attendanceModel.getTodayAttendanceCount(),
      attendanceModel.getAbsentCount(),
      attendanceModel.getLateCount(),
      leaveModel.getPendingLeavesCount(),
    ]);

    res.json({
      ok: true,
      data: {
        totalTeamMembers,
        presentToday,
        absentToday,
        lateToday,
        pendingLeaves,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get manager's team members
 * GET /api/manager/team?search=john&limit=10&offset=0
 */
async function getTeam(req, res, next) {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    // For now, get all employees. In production, filter by manager_id
    const result = await userModel.getAllUsers({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      role: 'employee',
      search: search || null,
    });

    res.json({
      ok: true,
      data: {
        employees: result.users,
        total: result.total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get team attendance records
 * GET /api/manager/team-attendance?period=today&limit=50&offset=0
 */
async function getTeamAttendance(req, res, next) {
  try {
    const { period = 'today', limit = 50, offset = 0 } = req.query;

    const records = await attendanceModel.getTeamAttendance({
      period,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json({
      ok: true,
      data: {
        attendance: records,
        period,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get pending leave requests for manager's team
 * GET /api/manager/leave-requests
 */
async function getLeaveRequests(req, res, next) {
  try {
    const leaves = await leaveModel.getPendingLeaves();
    res.json({
      ok: true,
      data: {
        leaves,
        count: leaves.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Approve leave request
 * POST /api/manager/leaves/:id/approve
 */
async function approveLeave(req, res, next) {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id, 10))) {
      const error = new Error('Invalid leave ID');
      error.status = 400;
      throw error;
    }

    const approved = await leaveModel.approveLeave(parseInt(id, 10), req.user.id);
    if (!approved) {
      const error = new Error('Leave request not found');
      error.status = 404;
      throw error;
    }

    await notificationService.sendLeaveStatusNotification(approved.user_id, 'approved', approved);

    res.json({
      ok: true,
      message: 'Leave request approved successfully',
      data: approved,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reject leave request
 * POST /api/manager/leaves/:id/reject
 */
async function rejectLeave(req, res, next) {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id, 10))) {
      const error = new Error('Invalid leave ID');
      error.status = 400;
      throw error;
    }

    const rejected = await leaveModel.rejectLeave(parseInt(id, 10), req.user.id);
    if (!rejected) {
      const error = new Error('Leave request not found');
      error.status = 404;
      throw error;
    }

    await notificationService.sendLeaveStatusNotification(rejected.user_id, 'rejected', rejected);

    res.json({
      ok: true,
      message: 'Leave request rejected successfully',
      data: rejected,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get manager reports
 * GET /api/manager/reports?period=weekly
 */
async function getReports(req, res, next) {
  try {
    const { period = 'weekly' } = req.query;

    let data;
    if (period === 'weekly') {
      data = await reportModel.getWeeklyReport();
    } else if (period === 'monthly') {
      data = await reportModel.getMonthlyReport();
    } else {
      const error = new Error('Invalid period. Use "weekly" or "monthly"');
      error.status = 400;
      throw error;
    }

    res.json({
      ok: true,
      data: {
        period,
        report: data,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  getTeam,
  getTeamAttendance,
  getLeaveRequests,
  approveLeave,
  rejectLeave,
  getReports,
};