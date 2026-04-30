-- Create leaves table
CREATE TABLE IF NOT EXISTS leaves (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL, -- sick, casual, unpaid, etc
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for queries by user and status
CREATE INDEX IF NOT EXISTS idx_leaves_user_status ON leaves(user_id, status);
CREATE INDEX IF NOT EXISTS idx_leaves_date_range ON leaves(start_date, end_date);
