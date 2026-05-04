/**
 * HR Controller
 * Handles HR-specific operations: employee management, attendance viewing, leave approvals
 */

const employeeModel = require('../models/employeeModel');
const leaveModel = require('../models/leaveModel');
const attendanceModel = require('../models/attendanceModel');
const reportModel = require('../models/reportModel');
const authService = require('../services/authService');
const notificationService = require('../services/notificationService');

/**
 * Get HR dashboard stats
 * GET /api/hr/dashboard
 */
async function getDashboard(req, res, next) {
  try {
    const stats = await employeeModel.getDashboardStats();
    res.json({ ok: true, data: stats });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all employees (managed by HR)
 * GET /api/hr/employees?search=john&limit=10&offset=0
 */
async function getEmployees(req, res, next) {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await employeeModel.getAllEmployees({
      search: search || null,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json({
      ok: true,
      data: {
        employees: result.employees,
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
 * Get single employee
 * GET /api/hr/employees/:id
 */
async function getEmployee(req, res, next) {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id, 10))) {
      const error = new Error('Invalid employee ID');
      error.status = 400;
      throw error;
    }

    const employee = await employeeModel.getEmployeeById(parseInt(id, 10));
    if (!employee) {
      const error = new Error('Employee not found');
      error.status = 404;
      throw error;
    }

    res.json({ ok: true, data: employee });
  } catch (error) {
    next(error);
  }
}

/**
 * Create new employee
 * POST /api/hr/employees
 * Body: { name, email, password }
 */
async function createEmployee(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error('Missing required fields: name, email, password');
      error.status = 400;
      throw error;
    }

    // Use auth service to create employee (handles password hashing)
    const ROLES = require('../constants/roles');
    const employee = await authService.createUserByAdmin(
      { email, password, name, role: ROLES.EMPLOYEE },
      req.user.id
    );

    res.status(201).json({
      ok: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update employee
 * PUT /api/hr/employees/:id
 * Body: { name, email }
 */
async function updateEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!id || isNaN(parseInt(id, 10))) {
      const error = new Error('Invalid employee ID');
      error.status = 400;
      throw error;
    }

    if (!name && !email) {
      const error = new Error('At least one field (name, email) must be provided');
      error.status = 400;
      throw error;
    }

    const updated = await employeeModel.updateEmployee(parseInt(id, 10), { name, email });
    if (!updated) {
      const error = new Error('Employee not found');
      error.status = 404;
      throw error;
    }

    res.json({ ok: true, message: 'Employee updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete employee
 * DELETE /api/hr/employees/:id
 */
async function deleteEmployee(req, res, next) {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id, 10))) {
      const error = new Error('Invalid employee ID');
      error.status = 400;
      throw error;
    }

    const deleted = await employeeModel.deleteEmployee(parseInt(id, 10));
    if (!deleted) {
      const error = new Error('Employee not found');
      error.status = 404;
      throw error;
    }

    res.json({ ok: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * Get attendance records (for HR to view)
 * GET /api/hr/attendance?period=today|weekly|monthly
 */
async function getAttendance(req, res, next) {
  try {
    const { period = 'today' } = req.query;
    const records = await attendanceModel.getAttendance({ period });

    res.json({
      ok: true,
      data: {
        attendance: records,
        period,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get summary attendance stats
 * GET /api/hr/attendance/stats/today
 */
async function getAttendanceStats(req, res, next) {
  try {
    const today = await employeeModel.getDashboardStats();

    res.json({
      ok: true,
      data: {
        present_today: today.present_today,
        absent_today: today.absent_today,
        late_today: today.late_today,
        total_employees: today.total_employees,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get daily report
 * GET /api/hr/reports/daily?date=YYYY-MM-DD
 */
async function getDailyReport(req, res, next) {
  try {
    const { date } = req.query;
    const data = await reportModel.getDailyReport(date || null);

    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

/**
 * Get monthly report
 * GET /api/hr/reports/monthly?year=YYYY&month=MM
 */
async function getMonthlyReport(req, res, next) {
  try {
    const { year, month } = req.query;
    const data = await reportModel.getMonthlyReport(
      year ? parseInt(year, 10) : null,
      month ? parseInt(month, 10) : null
    );

    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

/**
 * Get employee report
 * GET /api/hr/reports/employee/:id
 */
async function getEmployeeReport(req, res, next) {
  try {
    const { id } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    if (!id || isNaN(parseInt(id, 10))) {
      const error = new Error('Invalid employee ID');
      error.status = 400;
      throw error;
    }

    const data = await reportModel.getEmployeeReport(parseInt(id, 10), parseInt(limit, 10), parseInt(offset, 10));
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

/**
 * Get pending leave requests
 * GET /api/hr/leaves/pending
 */
async function getPendingLeaves(req, res, next) {
  try {
    const leaves = await leaveModel.getPendingLeaves();
    res.json({ ok: true, data: { leaves, count: leaves.length } });
  } catch (error) {
    next(error);
  }
}

/**
 * Approve leave request
 * POST /api/hr/leaves/:id/approve
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

    res.json({ ok: true, message: 'Leave approved successfully', data: approved });
  } catch (error) {
    next(error);
  }
}

/**
 * Reject leave request
 * POST /api/hr/leaves/:id/reject
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

    res.json({ ok: true, message: 'Leave rejected successfully', data: rejected });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAttendance,
  getAttendanceStats,
  getDailyReport,
  getMonthlyReport,
  getEmployeeReport,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
};
