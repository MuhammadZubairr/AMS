# Railway Backend Deployment Checklist

## ✅ Pre-Deployment Checklist

### Repository Setup
- [ ] Code pushed to GitHub repository
- [ ] `.env.example` file exists in backend root with all required variables
- [ ] `.env` file is NOT committed (check `.gitignore`)
- [ ] `Procfile` exists in backend root with correct content
- [ ] `package.json` has `start` script: `node src/server.js`
- [ ] `package.json` has `migrate` script: `db-migrate`

### Code Quality
- [ ] No hardcoded database URLs or secrets in code
- [ ] No hardcoded API URLs (should use env variables)
- [ ] CORS is configured with `FRONTEND_ORIGIN` env var
- [ ] All routes are tested locally and working
- [ ] Health check endpoint works: `curl http://localhost:4000/health/db`

### Environment Variables Ready
- [ ] `NODE_ENV=production`
- [ ] `PORT=4000` (or your desired port)
- [ ] `JWT_SECRET` generated securely
- [ ] `FRONTEND_ORIGIN` ready (will update after frontend deployed)
- [ ] Database credentials ready (Railway provides these)
- [ ] All other env vars documented

---

## 🚂 Railway Deployment Steps

### Step 1: Create Railway Account & Project
- [ ] Go to [railway.app](https://railway.app)
- [ ] Create account (GitHub login recommended)
- [ ] Click "New Project" or "Create"

### Step 2: Connect GitHub Repository
- [ ] Select "Deploy from GitHub"
- [ ] Authorize Railway to access GitHub
- [ ] Select your **devflx-attendance** repository
- [ ] Select "Deploy" to create initial deployment

### Step 3: Add PostgreSQL Database
- [ ] In Railway project, click "New" button
- [ ] Select "Database" → "PostgreSQL"
- [ ] Wait 2-3 minutes for provisioning
- [ ] Click PostgreSQL service to verify
- [ ] Check "Variables" tab for `DATABASE_URL` ✓

### Step 4: Add Redis (Optional)
- [ ] In Railway project, click "New"
- [ ] Select "Add Service" → "Redis"
- [ ] Wait for provisioning
- [ ] Verify `REDIS_URL` appears in Variables ✓

### Step 5: Configure Backend Environment
- [ ] Click on your Node.js/backend service
- [ ] Click "Variables" tab
- [ ] Click "Raw Editor"
- [ ] Add all required variables (see below)
- [ ] Copy from [BACKEND_ENV_TEMPLATE.md](./BACKEND_ENV_TEMPLATE.md)

**Critical Variables:**
```
NODE_ENV=production
PORT=4000
LOG_LEVEL=info
JWT_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRES_IN=7d
SALT_ROUNDS=12
FRONTEND_ORIGIN=http://localhost:3000
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
PG_POOL_MAX=20
```

### Step 6: Verify Deployment
- [ ] Check "Deployments" tab shows "✅ Deployment Successful"
- [ ] Check logs for "Server running on port 4000"
- [ ] Look for "migrations completed" in logs

### Step 7: Get Backend URL
- [ ] Click on backend service
- [ ] Go to "Settings" tab
- [ ] Copy public URL from "Domains" section
- [ ] Format: `https://backend-xxxxx.railway.app`
- [ ] Save this URL for frontend configuration ✓

### Step 8: Test Backend
- [ ] Run: `curl https://YOUR_RAILWAY_URL/health/db`
- [ ] Should return: `{"status":"ok","database":"connected",...}`
- [ ] Check API endpoints responding

---

## 🔍 Post-Deployment Verification

### Health Checks
- [ ] Backend `/health/db` endpoint returns 200 OK
- [ ] Database queries work (check logs)
- [ ] No connection timeout errors in logs
- [ ] Migrations completed successfully

### Monitoring
- [ ] Set up health check in Railway:
  - Path: `/health/db`
  - Interval: 30s
  - Timeout: 5s
- [ ] Railway auto-restarts on health check failure

### Initial Testing (After Frontend Connected)
- [ ] Frontend can make API calls to backend
- [ ] Login endpoint works
- [ ] User data can be fetched
- [ ] No CORS errors in browser console

---

## ⚠️ Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| 502 Bad Gateway | Backend crashed/down | Check Deployment logs in Railway |
| Database connection error | DATABASE_URL not set | Verify PostgreSQL exists & Variables populated |
| CORS errors | FRONTEND_ORIGIN wrong | Update FRONTEND_ORIGIN to actual frontend URL |
| Port conflicts | Multiple apps on same port | Ensure PORT=4000 and no other services use it |
| Build failed | Missing dependencies | Check `package.json` has all required packages |

---

## 📊 Useful Railway Commands

```bash
# View deployment logs (in Railway UI)
# Deployments tab → Select deployment → Click "Logs"

# Monitor real-time logs
# Services → backend → "Logs" tab

# Environment variables editor
# Services → backend → "Variables" tab → "Raw Editor"

# Restart deployment
# Deployments tab → Select deployment → "Restart"

# View all environment variables
# Services → backend → "Variables" tab
```

---

## ✅ Pre-Frontend-Connection Checklist

Before updating frontend to point to this backend:
- [ ] Backend URL is stable (same URL consistently)
- [ ] Health check passes: `curl https://YOUR_URL/health/db` → 200 OK
- [ ] Can access main endpoint: `curl https://YOUR_URL/` → {"ok":true}
- [ ] Login endpoint responds: `curl -X POST https://YOUR_URL/api/auth/login` → (responds, even if unauthorized)
- [ ] Database is connected and migrations completed
- [ ] JWT_SECRET is strong and unique
- [ ] All environment variables are set

---

## 🎯 Ready for Production?

Once all checks pass, your backend is ready to connect to the frontend deployment!

**Next Step:** Follow [COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md) to deploy frontend on Vercel.
