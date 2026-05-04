const db = require('../config/database');

/**
 * Get attendance records for a given period
 * period: 'today' | 'weekly' | 'monthly'
 */
async function getAttendance({ period = 'today' } = {}) {
  // Build date filter
  let whereClause = '';
  if (period === 'today') {
    whereClause = `WHERE DATE(a.created_at) = CURRENT_DATE`;
  } else if (period === 'weekly') {
    whereClause = `WHERE DATE(a.created_at) >= (CURRENT_DATE - INTERVAL '6 days')`;
  } else if (period === 'monthly') {
    whereClause = `WHERE DATE_TRUNC('month', a.created_at) = DATE_TRUNC('month', CURRENT_DATE)`;
  }

  const query = `
    SELECT
      u.id as user_id,
      u.name as user_name,
      u.email as user_email,
      a.check_in as check_in_time,
      a.check_out as check_out_time,
      a.mode,
      a.status,
      COALESCE(a.working_seconds, 0) as working_minutes
    FROM attendance a
    JOIN users u ON u.id = a.user_id
    ${whereClause}
    ORDER BY a.created_at DESC
  `;

  const { rows } = await db.query(query);

  const mapped = rows.map((r) => ({
    user_id: r.user_id,
    user_name: r.user_name,
    user_email: r.user_email,
    check_in_time: r.check_in_time,
    check_out_time: r.check_out_time,
    mode: r.mode,
    status: r.status,
    working_minutes: parseInt(r.working_minutes, 10),
  }));

  return mapped;
}

async function getAttendanceSummaryByUser(userId, { year = null, month = null } = {}) {
  const params = [userId];
  let whereClause = `DATE_TRUNC('month', a.created_at) = DATE_TRUNC('month', CURRENT_DATE)`;

  if (year && month) {
    whereClause = `EXTRACT(YEAR FROM a.created_at) = $2 AND EXTRACT(MONTH FROM a.created_at) = $3`;
    params.push(year, month);
  }

  const query = `
    SELECT
      COUNT(*) as total_days,
      SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_days,
      SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late_days,
      SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_days,
      AVG(a.working_seconds)::INTEGER as average_working_seconds
    FROM attendance a
    WHERE a.user_id = $1 AND ${whereClause}
  `;

  const { rows } = await db.query(query, params);
  const summary = rows[0] || {
    total_days: 0,
    present_days: 0,
    late_days: 0,
    absent_days: 0,
    average_working_seconds: 0,
  };

  return {
    total_days: parseInt(summary.total_days, 10),
    present_days: parseInt(summary.present_days, 10),
    late_days: parseInt(summary.late_days, 10),
    absent_days: parseInt(summary.absent_days, 10),
    average_working_seconds: parseInt(summary.average_working_seconds, 10),
  };
}

function formatWorkingHours(seconds) {
  if (!seconds) return '0h 0m';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
}

/**
 * Get today's attendance count
 * Returns count of employees who checked in today
 */
async function getTodayAttendanceCount() {
  const query = `
    SELECT COUNT(DISTINCT user_id) as count
    FROM attendance
    WHERE DATE(created_at) = CURRENT_DATE AND status = 'present'
  `;
  const { rows } = await db.query(query);
  return parseInt(rows[0].count, 10);
}

/**
 * Get absent count for today
 * Returns count of employees marked as absent today
 */
async function getAbsentCount() {
  const query = `
    SELECT COUNT(DISTINCT user_id) as count
    FROM attendance
    WHERE DATE(created_at) = CURRENT_DATE AND status = 'absent'
  `;
  const { rows } = await db.query(query);
  return parseInt(rows[0].count, 10);
}

/**
 * Get today's attendance record for a user
 * @param {number} userId - User ID
 * @returns {Promise<object>} Attendance record or null
 */
async function getTodayAttendanceByUser(userId) {
  const query = `
    SELECT id, user_id, check_in, check_out, status, mode, latitude, longitude, device_id, device_name, ip_address, created_at
    FROM attendance
    WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE
    LIMIT 1
  `;
  const { rows } = await db.query(query, [userId]);
  return rows[0] || null;
}

/**
 * Create attendance check-in record
 * @param {object} data - Attendance data
 * @returns {Promise<object>} Created attendance record
 */
async function createCheckIn(data) {
  const {
    user_id,
    check_in,
    status,
    mode,
    latitude,
    longitude,
    device_id,
    device_name,
    ip_address,
  } = data;

  const query = `
    INSERT INTO attendance (
      user_id, check_in, status, mode, latitude, longitude,
      device_id, device_name, ip_address, created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
    RETURNING id, user_id, check_in, check_out, status, mode, latitude, longitude, device_id, device_name, ip_address, created_at
  `;

  const { rows } = await db.query(query, [
    user_id,
    check_in,
    status,
    mode,
    latitude || null,
    longitude || null,
    device_id || null,
    device_name || null,
    ip_address || null,
  ]);

  return rows[0];
}

/**
 * Update attendance check-out record
 * @param {number} attendanceId - Attendance record ID
 * @param {object} data - Check-out data
 * @returns {Promise<object>} Updated attendance record
 */
async function updateCheckOut(attendanceId, data) {
  const {
    check_out,
    mode,
    latitude,
    longitude,
    device_id,
    device_name,
    ip_address,
  } = data;

  const query = `
    UPDATE attendance
    SET
      check_out = $2,
      mode = CASE WHEN mode IS NULL OR mode = '' THEN $3 ELSE mode END,
      latitude = CASE WHEN latitude IS NULL THEN $4 ELSE latitude END,
      longitude = CASE WHEN longitude IS NULL THEN $5 ELSE longitude END,
      device_id = CASE WHEN device_id IS NULL THEN $6 ELSE device_id END,
      device_name = CASE WHEN device_name IS NULL THEN $7 ELSE device_name END,
      ip_address = CASE WHEN ip_address IS NULL THEN $8 ELSE ip_address END,
      working_seconds = EXTRACT(EPOCH FROM ($2 - check_in))::INTEGER
    WHERE id = $1
    RETURNING id, user_id, check_in, check_out, status, mode, latitude, longitude, device_id, device_name, ip_address, created_at
  `;

  const { rows } = await db.query(query, [
    attendanceId,
    check_out,
    mode || 'OFFICE',
    latitude || null,
    longitude || null,
    device_id || null,
    device_name || null,
    ip_address || null,
  ]);

  return rows[0];
}

/**
 * Get attendance history for a single employee
 * @param {number} userId - User ID
 * @param {object} options - Pagination options
 * @returns {Promise<object>} Attendance history and total count
 */
async function getAttendanceHistoryByUser(
  userId,
  { limit = 30, offset = 0, from = null, to = null, status = null, workType = null } = {}
) {
  // Build dynamic where clause and params safely
  const params = [userId];
  let idx = 2;
  let where = 'WHERE user_id = $1';

  if (from) {
    where += ` AND DATE(created_at) >= $${idx}`;
    params.push(from);
    idx += 1;
  }

  if (to) {
    where += ` AND DATE(created_at) <= $${idx}`;
    params.push(to);
    idx += 1;
  }

  if (status) {
    where += ` AND status = $${idx}`;
    params.push(status);
    idx += 1;
  }

  if (workType) {
    where += ` AND mode = $${idx}`;
    params.push(workType);
    idx += 1;
  }

  const countQuery = `
    SELECT COUNT(*)::INTEGER AS total
    FROM attendance
    ${where}
  `;

  // add limit/offset params at the end
  params.push(limit, offset);

  const dataQuery = `
    SELECT
      id,
      DATE(created_at) AS date,
      check_in,
      check_out,
      mode,
      status,
      COALESCE(working_seconds, 0) as working_seconds
    FROM attendance
    ${where}
    ORDER BY created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;

  const [countResult, dataResult] = await Promise.all([
    db.query(countQuery, params.slice(0, params.length - 2)),
    db.query(dataQuery, params),
  ]);

  // Map working_seconds to human readable format
  const records = dataResult.rows.map((r) => ({
    id: r.id,
    date: r.date,
    check_in: r.check_in,
    check_out: r.check_out,
    work_type: r.mode,
    status: r.status,
    working_hours: formatWorkingHours(r.working_seconds),
  }));

  return {
    total: countResult.rows[0].total,
    records,
  };
}

/**
 * Get late count for today
 * Returns count of employees who were late today
 */
async function getLateCount() {
  const query = `
    SELECT COUNT(DISTINCT user_id) as count
    FROM attendance
    WHERE DATE(created_at) = CURRENT_DATE AND status = 'late'
  `;
  const { rows } = await db.query(query);
  return parseInt(rows[0].count, 10);
}

/**
 * Get team attendance records (for managers)
 * Returns attendance records for all employees
 */
async function getTeamAttendance({ period = 'today', limit = 50, offset = 0 } = {}) {
  // Build date filter
  let whereClause = '';
  if (period === 'today') {
    whereClause = `WHERE DATE(a.created_at) = CURRENT_DATE`;
  } else if (period === 'weekly') {
    whereClause = `WHERE DATE(a.created_at) >= (CURRENT_DATE - INTERVAL '6 days')`;
  } else if (period === 'monthly') {
    whereClause = `WHERE DATE_TRUNC('month', a.created_at) = DATE_TRUNC('month', CURRENT_DATE)`;
  }

  const query = `
    SELECT
      u.id as user_id,
      u.name as employee_name,
      u.email as employee_email,
      a.check_in,
      a.check_out,
      a.status,
      a.mode,
      COALESCE(a.working_seconds, 0) as working_seconds,
      a.created_at
    FROM attendance a
    JOIN users u ON u.id = a.user_id
    ${whereClause}
    ORDER BY a.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const { rows } = await db.query(query, [limit, offset]);

  // Map working_seconds to human readable hours:minutes
  const mapped = rows.map((r) => ({
    user_id: r.user_id,
    employee_name: r.employee_name,
    employee_email: r.employee_email,
    check_in: r.check_in,
    check_out: r.check_out,
    status: r.status,
    mode: r.mode,
    working_hours: formatWorkingHours(r.working_seconds),
    date: r.created_at,
  }));

  return mapped;
}

/**
 * Create absent record for employee
 * @param {number} userId - User ID
 * @returns {Promise<object>} Created absent record
 */
async function createAbsentRecord(userId) {
  const query = `
    INSERT INTO attendance (
      user_id, status, mode, created_at
    )
    VALUES ($1, 'absent', 'OFFICE', CURRENT_DATE)
    RETURNING id, user_id, status, mode, created_at
  `;

  const { rows } = await db.query(query, [userId]);
  return rows[0];
}

module.exports = {
  getAttendance,
  getTodayAttendanceCount,
  getAbsentCount,
  getLateCount,
  getTodayAttendanceByUser,
  createCheckIn,
  updateCheckOut,
  getAttendanceHistoryByUser,
  getAttendanceSummaryByUser,
  getTeamAttendance,
  createAbsentRecord,
};
