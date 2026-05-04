const reportModel = require('../models/reportModel');
const { cacheGet, cacheSet } = require('../config/redis');

/**
 * Daily report endpoint
 * GET /api/reports/daily?date=YYYY-MM-DD
 */
async function dailyReport(req, res, next) {
  try {
    const { date } = req.query;
    const data = await reportModel.getDailyReport(date || null);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * Monthly report endpoint
 * GET /api/reports/monthly?year=YYYY&month=MM
 */
async function monthlyReport(req, res, next) {
  try {
    const { year, month } = req.query;
    const y = year ? parseInt(year, 10) : null;
    const m = month ? parseInt(month, 10) : null;
    const cacheKey = `reports:monthly:${y || 'current'}:${m || 'current'}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.json({ ok: true, data: cached });
    }

    const data = await reportModel.getMonthlyReport(y, m);
    try {
      await cacheSet(cacheKey, data, 20); // 20s cache
    } catch (err) {}

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * Employee report endpoint
 * GET /api/reports/employee/:id?limit=100&offset=0
 */
async function employeeReport(req, res, next) {
  try {
    const { id } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    if (!id || isNaN(parseInt(id, 10))) {
      const error = new Error('Invalid employee id');
      error.status = 400;
      throw error;
    }
    const data = await reportModel.getEmployeeReport(parseInt(id, 10), parseInt(limit, 10), parseInt(offset, 10));
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  dailyReport,
  monthlyReport,
  employeeReport,
};
