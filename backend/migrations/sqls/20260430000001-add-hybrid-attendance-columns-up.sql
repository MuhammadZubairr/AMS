-- Add hybrid attendance mode and geo-location columns
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS mode VARCHAR(20) DEFAULT 'OFFICE';
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS device_id VARCHAR(255);
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS device_name VARCHAR(255);
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);

-- Add index for mode query optimization
CREATE INDEX IF NOT EXISTS idx_attendance_mode ON attendance(mode);
