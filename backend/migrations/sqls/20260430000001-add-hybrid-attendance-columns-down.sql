-- Rollback: Remove hybrid attendance columns
ALTER TABLE attendance DROP COLUMN IF EXISTS ip_address;
ALTER TABLE attendance DROP COLUMN IF EXISTS device_name;
ALTER TABLE attendance DROP COLUMN IF EXISTS device_id;
ALTER TABLE attendance DROP COLUMN IF EXISTS longitude;
ALTER TABLE attendance DROP COLUMN IF EXISTS latitude;
ALTER TABLE attendance DROP COLUMN IF EXISTS mode;

-- Drop index
DROP INDEX IF EXISTS idx_attendance_mode;
