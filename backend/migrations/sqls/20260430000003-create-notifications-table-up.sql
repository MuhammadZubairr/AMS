CREATE TABLE IF NOT EXISTS notifications (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  message text NOT NULL,
  type varchar(50) NOT NULL, -- late_checkin, leave_status, attendance_missing, etc.
  related_to_id bigint, -- ID of related entity (leave, attendance, etc.)
  related_to_type varchar(50), -- leave, attendance, etc.
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for faster queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);