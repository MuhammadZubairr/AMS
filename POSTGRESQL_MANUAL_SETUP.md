# PostgreSQL Setup Guide - Manual Installation

## Current Issue
PostgreSQL is **not installed** on your system. The Homebrew installation is taking a long time.

## Solution: Manual Installation

### Option A: Using PostgreSQL.app (Easiest for macOS)

1. Download PostgreSQL.app from: **https://postgresapp.com/**
2. Drag to Applications folder
3. Run the app
4. Click "Initialize" to create the default database cluster
5. Click the elephant icon (menu bar) and select "Open psql"

**Alternative via official installer:**
- Download from: https://www.postgresql.org/download/macosx/
- Run the installer
- Use default settings

---

### Option B: Command Line Installation (if Homebrew works)

Try this simpler command:
```bash
brew install postgresql@15
brew services start postgresql@15
initdb /usr/local/var/postgres@15 -U postgres
```

---

### Option C: Docker (Alternative)

If you have Docker installed:

```bash
docker run --name devflx-db -e POSTGRES_USER=devflx_user \
  -e POSTGRES_PASSWORD=devflx_password_123 \
  -e POSTGRES_DB=devflx_attendance \
  -p 5432:5432 -d postgres:15
```

---

## After Installation: Initialize Database

Once PostgreSQL is installed and running, run these commands**in a terminal**:

```bash
# 1. Create the database user
createuser devflx_user -P
# (Enter password when prompted: devflx_password_123)

# 2. Create the database
createdb -O devflx_user devflx_attendance

# 3. Verify connection
psql -h localhost -U devflx_user -d devflx_attendance -c "SELECT version();"
```

---

## Then Start the Backend

Once database is ready:

```bash
cd backend
npm run dev
```

Expected success output:
```
✓ Backend running on port 4000
```

---

## Troubleshooting

### Error: "psql: command not found"
- PostgreSQL is not installed or not in PATH
- Try PostgreSQL.app from postgresapp.com

### Error: "could not connect to server"
- PostgreSQL service is not running
- macOS: Start from PostgreSQL.app menu
- Homebrew: Run `brew services start postgresql@15`

### Error: "database does not exist"
- Run: `createdb -O devflx_user devflx_attendance`

---

## Quick Status Check

After setup, verify everything works:

```bash
# Check if PostgreSQL is running
brew services list

# Check if database exists
psql -U postgres -l | grep devflx

# Test backend connection
curl http://localhost:4000/health/db
```

---

Choose **Option A (PostgreSQL.app) - it's the fastest and easiest on macOS!**
