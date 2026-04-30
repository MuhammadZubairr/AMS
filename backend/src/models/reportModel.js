const db = require('../config/database');

/**
 * Get aggregated daily report for a specific date (defaults to today)
 * Returns counts: present, absent, total, late
 */
async function getDailyReport(date = null) {
  const dateFilter = date ? `DATE(a.created_at) = $1` : `DATE(a.created_at) = CURRENT_DATE`;
  const params = date ? [date] : [];

  const query = `
    SELECT
      SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
      SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent,
      SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late,
      COUNT(DISTINCT a.user_id) as total
    FROM attendance a
    WHERE ${dateFilter}
  `;

  const { rows } = await db.query(query, params);
  return rows[0];
}

/**
 * Get aggregated monthly report for the current month
 */
async function getMonthlyReport(year = null, month = null) {
  if (!year || !month) {
    // use current month
    const query = `
      SELECT
        DATE_TRUNC('day', a.created_at)::date as day,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent
      FROM attendance a
      WHERE DATE_TRUNC('month', a.created_at) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY day
      ORDER BY day ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  const query = `
    SELECT
      DATE_TRUNC('day', a.created_at)::date as day,
      SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
      SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent
    FROM attendance a
    WHERE EXTRACT(YEAR FROM a.created_at) = $1 AND EXTRACT(MONTH FROM a.created_at) = $2
    GROUP BY day
    ORDER BY day ASC
  `;
  const { rows } = await db.query(query, [year, month]);
  return rows;
}

/**
 * Get attendance history for a single employee
 */
async function getEmployeeReport(userId, limit = 100, offset = 0) {
  const query = `
    SELECT a.id, a.user_id, a.check_in, a.check_out, a.status, a.working_seconds, a.created_at
    FROM attendance a
    WHERE a.user_id = $1
    ORDER BY a.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const { rows } = await db.query(query, [userId, limit, offset]);
  return rows;
}

/**
 * Get weekly attendance summary
 */
async function getWeeklyReport() {
  const query = `
    SELECT
      DATE_TRUNC('day', a.created_at)::date as day,
      COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.user_id END) as present,
      COUNT(DISTINCT CASE WHEN a.status = 'absent' THEN a.user_id END) as absent,
      COUNT(DISTINCT CASE WHEN a.status = 'late' THEN a.user_id END) as late,
      COUNT(DISTINCT a.user_id) as total
    FROM attendance a
    WHERE DATE(a.created_at) >= (CURRENT_DATE - INTERVAL '6 days')
    GROUP BY day
    ORDER BY day ASC
  `;

  const { rows } = await db.query(query);
  return rows;
}

module.exports = {
  getDailyReport,
  getMonthlyReport,
  getEmployeeReport,
  getWeeklyReport,
};
