/**
 * Super Admin Controller
 * Handles super admin dashboard and user management operations
 */

const userModel = require('../models/userModel');
const authService = require('../services/authService');
const attendanceModel = require('../models/attendanceModel');
const ROLES = require('../constants/roles');
const { cacheGet, cacheSet } = require('../config/redis');

/**
 * Get dashboard statistics
 * GET /api/superadmin/dashboard
 */
async function getDashboard(req, res, next) {
  try {
    // Try short-lived cache first
    const cacheKey = 'dashboard:superadmin';
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.json({ ok: true, data: cached });
    }
    const [totalUsers, totalManagers, totalHr, totalEmployees, totalSuperAdmins, todayAttendance, absentCount] = await Promise.all([
      userModel.countTotal(),
      userModel.countByRole(ROLES.MANAGER),
      userModel.countByRole(ROLES.HR),
      userModel.countByRole(ROLES.EMPLOYEE),
      userModel.countByRole(ROLES.SUPERADMIN),
      attendanceModel.getTodayAttendanceCount(),
      attendanceModel.getAbsentCount(),
    ]);

    const payload = {
      totalUsers,
      breakdown: {
        superadmins: totalSuperAdmins,
        managers: totalManagers,
        hr: totalHr,
        employees: totalEmployees,
      },
      attendance: {
        todayCount: todayAttendance,
        absentCount: absentCount,
      },
    };

    // Cache for a short period to reduce DB pressure on dashboard refreshes
    try {
      await cacheSet(cacheKey, payload, 10); // 10s cache
    } catch (err) {
      // non-fatal
    }

    res.json({ ok: true, data: payload });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all users with optional filtering and search
 * GET /api/superadmin/users?role=manager&search=john&limit=10&offset=0
 */
async function getUsers(req, res, next) {
  try {
    const { role, search, limit = 10, offset = 0 } = req.query;
    
    const result = await userModel.getAllUsers({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      role: role || null,
      search: search || null,
    });

    res.json({
      ok: true,
      data: {
        users: result.users,
        total: result.total,
        count: result.users.length,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new manager
 * POST /api/superadmin/create-manager
 * Body: { name, email, password }
 */
async function createManager(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      const error = new Error('Missing required fields: name, email, password');
      error.status = 400;
      throw error;
    }

    // Create manager
    const user = await authService.createUserByAdmin(
      { email, password, name, role: ROLES.MANAGER },
      req.user.id
    );

    res.status(201).json({
      ok: true,
      message: 'Manager created successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new HR user
 * POST /api/superadmin/create-hr
 * Body: { name, email, password }
 */
async function createHr(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      const error = new Error('Missing required fields: name, email, password');
      error.status = 400;
      throw error;
    }

    // Create HR user
    const user = await authService.createUserByAdmin(
      { email, password, name, role: ROLES.HR },
      req.user.id
    );

    res.status(201).json({
      ok: true,
      message: 'HR user created successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a generic user (manager | hr | employee)
 * POST /api/superadmin/create-user
 * Body: { name, email, password, role }
 */
async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      const error = new Error('Missing required fields: name, email, password, role');
      error.status = 400;
      throw error;
    }

    // Delegate to auth service which validates password and hashes it
    const user = await authService.createUserByAdmin(
      { email, password, name, role },
      req.user.id
    );

    res.status(201).json({ ok: true, message: 'User created successfully', data: user });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user details (for superadmin viewing)
 * GET /api/superadmin/users/:userId
 */
async function getUserDetails(req, res, next) {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Verify password meets requirements (for frontend to show requirements before submit)
 * POST /api/superadmin/verify-password
 * Body: { password }
 */
async function verifyPassword(req, res, next) {
  try {
    const { password } = req.body;

    if (!password) {
      const error = new Error('Password is required');
      error.status = 400;
      throw error;
    }

    const { validatePassword } = require('../utils/passwordValidator');
    const validation = validatePassword(password);

    res.json({
      ok: true,
      isValid: validation.isValid,
      errors: validation.errors,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user role or other details
 * PUT /api/superadmin/users/:id
 * Body: { role, name }
 * Allowed roles: manager, hr, employee, superadmin
 */
async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role, name } = req.body;

    // Validate user ID
    if (!id || isNaN(id)) {
      const error = new Error('Invalid user ID');
      error.status = 400;
      throw error;
    }

    // Validate that at least one field is provided
    if (!role && !name) {
      const error = new Error('At least one field (role, name) must be provided');
      error.status = 400;
      throw error;
    }

    // If role is provided, validate it
    const validRoles = [ROLES.SUPERADMIN, ROLES.MANAGER, ROLES.HR, ROLES.EMPLOYEE];
    if (role && !validRoles.includes(role)) {
      const error = new Error(`Invalid role. Allowed roles: ${validRoles.join(', ')}`);
      error.status = 400;
      throw error;
    }

    // Prevent updating own role
    if (req.user.id === parseInt(id, 10) && role) {
      const error = new Error('You cannot change your own role');
      error.status = 403;
      throw error;
    }

    // Build updates object
    const updates = {};
    if (role) updates.role = role;
    if (name) updates.name = name;

    // Update user
    const updatedUser = await userModel.updateUser(parseInt(id, 10), updates);

    res.json({
      ok: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a user
 * DELETE /api/superadmin/users/:id
 * Safety rule: Cannot delete another superadmin
 */
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    // Validate ID is numeric
    if (!id || isNaN(parseInt(id, 10))) {
      const error = new Error('Invalid user ID');
      error.status = 400;
      throw error;
    }

    const userId = parseInt(id, 10);

    // Prevent deleting own account
    if (req.user.id === userId) {
      const error = new Error('You cannot delete your own account');
      error.status = 403;
      throw error;
    }

    // Check if target user is a superadmin - prevent deletion
    const targetUser = await userModel.findById(userId);
    if (!targetUser) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    if (targetUser.role === ROLES.SUPERADMIN) {
      const error = new Error('Cannot delete another superadmin');
      error.status = 403;
      throw error;
    }

    // Delete the user
    const result = await userModel.deleteUser(userId);

    res.json({
      ok: true,
      message: `User ${targetUser.email} deleted successfully`,
      data: { id: result.id },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all managers
 * GET /api/superadmin/managers
 */
async function getManagers(req, res, next) {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await userModel.getAllUsers({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      role: ROLES.MANAGER,
      search: search || null,
    });

    res.json({
      ok: true,
      data: {
        users: result.users,
        total: result.total,
        count: result.users.length,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update a manager
 * PUT /api/superadmin/managers/:id
 * Body: { name, email } - Can update name and email
 */
async function updateManager(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Validate ID is numeric
    if (!id || isNaN(parseInt(id, 10))) {
      const error = new Error('Invalid manager ID');
      error.status = 400;
      throw error;
    }

    const managerId = parseInt(id, 10);

    // Validate that at least one field is provided
    if (!name && !email) {
      const error = new Error('At least one field (name, email) must be provided');
      error.status = 400;
      throw error;
    }

    // Get the manager to verify role
    const manager = await userModel.findById(managerId);
    if (!manager) {
      const error = new Error('Manager not found');
      error.status = 404;
      throw error;
    }

    if (manager.role !== ROLES.MANAGER) {
      const error = new Error('User is not a manager');
      error.status = 400;
      throw error;
    }

    // Check if email is already in use by another user
    if (email && email !== manager.email) {
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        const error = new Error('Email is already in use');
        error.status = 400;
        throw error;
      }
    }

    // Build updates object
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    // Update manager
    const updatedManager = await userModel.updateUser(managerId, updates);

    res.json({
      ok: true,
      message: 'Manager updated successfully',
      data: updatedManager,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all HR users
 * GET /api/superadmin/hr
 */
async function getHR(req, res, next) {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await userModel.getAllUsers({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      role: ROLES.HR,
      search: search || null,
    });

    res.json({
      ok: true,
      data: {
        users: result.users,
        total: result.total,
        count: result.users.length,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update an HR user
 * PUT /api/superadmin/hr/:id
 * Body: { name, email } - Can update name and email
 */
async function updateHR(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Validate ID is numeric
    if (!id || isNaN(parseInt(id, 10))) {
      const error = new Error('Invalid HR user ID');
      error.status = 400;
      throw error;
    }

    const hrId = parseInt(id, 10);

    // Validate that at least one field is provided
    if (!name && !email) {
      const error = new Error('At least one field (name, email) must be provided');
      error.status = 400;
      throw error;
    }

    // Get the HR user to verify role
    const hrUser = await userModel.findById(hrId);
    if (!hrUser) {
      const error = new Error('HR user not found');
      error.status = 404;
      throw error;
    }

    if (hrUser.role !== ROLES.HR) {
      const error = new Error('User is not an HR user');
      error.status = 400;
      throw error;
    }

    // Check if email is already in use by another user
    if (email && email !== hrUser.email) {
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        const error = new Error('Email is already in use');
        error.status = 400;
        throw error;
      }
    }

    // Build updates object
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    // Update HR user
    const updatedHR = await userModel.updateUser(hrId, updates);

    res.json({
      ok: true,
      message: 'HR user updated successfully',
      data: updatedHR,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get attendance for superadmin view
 * GET /api/superadmin/today-attendance?period=today|weekly|monthly
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

module.exports = {
  getDashboard,
  getUsers,
  createManager,
  createHr,
  createUser,
  getUserDetails,
  verifyPassword,
  updateUserRole,
  deleteUser,
  getManagers,
  updateManager,
  getHR,
  updateHR,
  getAttendance,
};
