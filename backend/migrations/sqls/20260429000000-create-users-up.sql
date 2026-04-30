CREATE TABLE IF NOT EXISTS users (
  id bigserial PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  role varchar(50) NOT NULL DEFAULT 'employee',
  created_by bigint REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
