const leaveModel = require('../models/leaveModel');
const userModel = require('../models/userModel');
const notificationService = require('../services/notificationService');

const ALLOWED_LEAVE_TYPES = ['sick', 'casual', 'paid', 'unpaid'];

async function requestLeave(req, res, next) {
  try {
    const { leave_type, start_date, end_date, reason } = req.body;
    const userId = req.user.id;

    if (!leave_type || !start_date || !end_date || !reason) {
      const error = new Error('Missing required fields: leave_type, start_date, end_date, reason');
      error.status = 400;
      throw error;
    }

    if (!ALLOWED_LEAVE_TYPES.includes(leave_type.toLowerCase())) {
      const error = new Error(`Invalid leave type. Allowed types: ${ALLOWED_LEAVE_TYPES.join(', ')}`);
      error.status = 400;
      throw error;
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      const error = new Error('Invalid date format for start_date or end_date');
      error.status = 400;
      throw error;
    }

    if (end < start) {
      const error = new Error('end_date must be the same or after start_date');
      error.status = 400;
      throw error;
    }

    const leave = await leaveModel.createLeave({
      user_id: userId,
      leave_type: leave_type.toLowerCase(),
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
      reason,
    });

    const requester = await userModel.findById(userId);

    await notificationService.notifyDepartmentMembers(
      'hr',
      'New Leave Request',
      `${requester?.name || 'An employee'} submitted a ${leave.leave_type} leave request from ${leave.start_date} to ${leave.end_date}.`,
      'leave_request',
      leave.id,
      'leave'
    );

    res.status(201).json({ ok: true, message: 'Leave request submitted', data: leave });
  } catch (error) {
    next(error);
  }
}

async function getMyLeaves(req, res, next) {
  try {
    const userId = req.user.id;
    const leaves = await leaveModel.getEmployeeLeaves(userId);
    res.json({ ok: true, data: { leaves } });
  } catch (error) {
    next(error);
  }
}

module.exports = { requestLeave, getMyLeaves };
