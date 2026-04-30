# Quick Connection Testing Guide
**Last Updated:** April 30, 2026

## Current Status
✅ **Frontend-Backend Connection:** Configured & Ready  
✅ **Backend API Server:** Starts successfully on port 4000  
❌ **Database Connection:** PostgreSQL not running  
❌ **Overall System:** Cannot operate without database

---

## Quick Test (10 minutes)

### 1️⃣ Check PostgreSQL Installation
```bash
# Check if PostgreSQL is installed with Homebrew
brew list | grep postgresql

# Expected output: postgresql@15 or similar version
```

### 2️⃣ Start PostgreSQL
```bash
# Start the service
brew services start postgresql@15

# Verify it's running
brew services list | grep postgresql
# Should show: postgresql@15 started <username> /Library/LaunchAgents/homebrew.mxcl.postgresql@15.plist
```

### 3️⃣ Start Backend Server
```bash
cd backend
npm run dev
```
**Expected Output:**
```
⚠ Continuing without seeding...
[INFO] 2026-04-30T11:53:16.518Z - [Cron] Initializing cron jobs
[INFO] 2026-04-30T11:53:16.714Z - [Cron] Cron jobs initialized successfully
✓ Backend running on port 4000
```

### 4️⃣ Test Database Health Check (in new terminal)
```bash
curl http://localhost:4000/health/db
```
**Expected Response:**
```json
{"status": "ok", "message": "Database connected"}
```
or similar success message

**Actual Current Response (with DB offline):**
```json
{"error": "Database connection failed"} 
```

### 5️⃣ Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```
**Expected Output:**
```
  ▲ Next.js 14.2.35
  - Local:        http://localhost:3000
  - Environments: .env.local
```

### 6️⃣ Test Front-End to Back-End Connection
1. Open http://localhost:3000 in browser
2. Open DevTools (F12) → Network tab
3. Try to login with credentials:
   - Email: `saqib.mustafa@gmail.com`
   - Password: `Saqib@123`
4. Check network requests - should see:
   - POST to `http://localhost:4000/api/auth/login`
   - Response should include user data and JWT token

---

## Expected Flow When Everything Works

```
User Browser (localhost:3000)
         ↓
    Frontend (Next.js)
         ↓ (HTTP Request with credentials)
http://localhost:4000/api/auth/login
         ↓
    Backend (Express)
         ↓ (SQL Query)
Database (PostgreSQL - localhost:5432)
         ↓ (User data)
    Backend
         ↓ (JSON + JWT Cookie)
    Frontend
         ↓ (Store token)
User Dashboard
```

---

## Troubleshooting

### Problem: "Cannot find module 'node-cron'"
**Solution:**
```bash
cd backend
npm install
```

### Problem: Database connection failed
**Check:**
```bash
# Is PostgreSQL installed?
brew list | grep postgresql

# Is it running?
brew services list

# If not running:
brew services start postgresql@15

# Create database if needed
createdb devflx_attendance
```

### Problem: CORS errors in browser console
**Check:** Backend CORS is configured for `http://localhost:3000`
- Already set in `backend/src/app.js`
- Frontend is running on port 3000
- No additional setup needed

### Problem: 401/403 Unauthorized errors
**Check:**
1. Are super admin accounts seeded? (requires running DB)
2. Is JWT_SECRET the same on backend?
3. Are cookies being sent with requests? (credentials: 'include' is set)

### Problem: Slow API responses
**Check:**
1. Is database query taking long?
2. Run: `npm run dev` (dev mode with faster reloads)
3. Check backend terminal for slow query logs

---

## Files Involved in Connection

### Backend
- `backend/.env` - Database URL and credentials
- `backend/src/config/database.js` - Connection pool
- `backend/src/app.js` - CORS configuration
- `backend/src/server.js` - Startup logic

### Frontend
- `frontend/src/services/api.js` - API client
- `frontend/src/constants/endpoints.ts` - API endpoints
- `frontend/src/services/superadminApi.ts` - Typed API calls
- `frontend/.env.local` (create if needed) - API base URL

### Database
- `backend/migrations/` - SQL scripts
- `backend/seeds/superadminSeeder.js` - Initial data

---

## Full Environment Info

**Backend:**
- Node.js version: 22.21.0
- Express.js: 4.22.1
- Database: PostgreSQL (pg 8.20.0)
- Auth: JWT + Cookies

**Frontend:**
- Next.js: 14.2.35
- React: 18.3.1
- TypeScript: 6.0.3
- HTTP Client: Fetch API

**Database:**
- Engine: PostgreSQL
- Host: localhost
- Port: 5432
- User: devflx_user
- Database: devflx_attendance

---

## Summary

✅ **What's Working:**
- Frontend code is set up correctly
- Backend server code is ready
- API endpoints are defined
- CORS is configured
- Dependencies are installed

❌ **What's Missing:**
- PostgreSQL service needs to be started
- Database tables need to be created (via migrations)
- Super admin accounts need to be seeded

👉 **Next Step:** Start PostgreSQL service and run the backend!
