/* eslint-disable camelcase */
exports.up = function (db) {
  return db.runSql(`
    CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users ((lower(email)));
    CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

    CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance (user_id);
    CREATE INDEX IF NOT EXISTS idx_attendance_created_at ON attendance (created_at);
    CREATE INDEX IF NOT EXISTS idx_attendance_user_created_at ON attendance (user_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at ON notifications (user_id, created_at DESC);
  `);
};

exports.down = function (db) {
  return db.runSql(`
    DROP INDEX IF EXISTS idx_users_email_lower;
    DROP INDEX IF EXISTS idx_users_created_at;

    DROP INDEX IF EXISTS idx_attendance_user_id;
    DROP INDEX IF EXISTS idx_attendance_created_at;
    DROP INDEX IF EXISTS idx_attendance_user_created_at;

    DROP INDEX IF EXISTS idx_notifications_user_created_at;
  `);
};

exports._meta = { "version": 1 };
