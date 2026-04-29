const db = require('../config/database');

async function checkDatabase(req, res, next) {
  try {
    const result = await db.query('SELECT 1 AS ok');

    res.status(200).json({
      status: 'ok',
      database: 'connected',
      result: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { checkDatabase };
