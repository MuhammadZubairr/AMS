# 🚀 Complete Deployment Guide: Vercel (Frontend) + Railway (Backend)

**DevFlx Attendance Management System**  
Last Updated: May 5, 2026

---

## 📋 Table of Contents

1. [Prerequisites & Setup](#prerequisites)
2. [Backend Deployment (Railway)](#railway-backend)
3. [Frontend Deployment (Vercel)](#vercel-frontend)
4. [Connect Frontend to Backend](#connection)
5. [Environment Variables Checklist](#env-checklist)
6. [Verification & Testing](#verification)
7. [Troubleshooting](#troubleshooting)

---

<a name="prerequisites"></a>
## ✅ Prerequisites & Setup

### Required Accounts
- **GitHub Account** (for code repository)
- **Railway Account** ([railway.app](https://railway.app)) - FREE tier available
- **Vercel Account** ([vercel.com](https://vercel.com)) - FREE tier available

### Before Starting
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DevFlx Attendance System"
   git remote add origin https://github.com/YOUR_USERNAME/devflx-attendance.git
   git push -u origin main
   ```

2. Verify your local setup works:
   ```bash
   cd backend && npm install && npm run dev
   # In another terminal:
   cd frontend && npm install && npm run dev
   # Test at http://localhost:3000
   ```

---

<a name="railway-backend"></a>
## 🚂 Backend Deployment (Railway)

### Step 1: Create Railway Project

1. Go to [railway.app/dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Click **"Configure GitHub App"** and authorize Railway
5. Select your **devflx-attendance** repository
6. Select **"Deploy"** for the entire repo (or service group)

### Step 2: Create PostgreSQL Database

Inside your Railway project:

1. Click **"New"** button (bottom right)
2. Select **"Database"** → **"PostgreSQL"**
3. Wait for database to provision (2-3 minutes)
4. Connection details auto-populate in environment

**Verify PostgreSQL:**
- Click on PostgreSQL service in Railway dashboard
- Click **"Variables"** tab
- Should see: `DATABASE_URL` with full connection string

### Step 3: Add Redis (Optional but Recommended)

1. Click **"New"** in Railway project
2. Select **"Add Service"** → **"Redis"**
3. Wait for Redis to provision
4. `REDIS_URL` auto-populates

### Step 4: Configure Backend Environment Variables

Click on **"backend"** service (or your Node.js service) in Railway:

1. Click **"Variables"** tab
2. Click **"Raw Editor"** (easier for multiple variables)
3. Copy and paste these variables:

```env
NODE_ENV=production
PORT=4000
LOG_LEVEL=info

# These auto-populate from Railway PostgreSQL service:
# DATABASE_URL=postgresql://...

# These auto-populate from Railway Redis service (if added):
# REDIS_URL=redis://...

# SECURITY: Generate new secure values
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE
JWT_EXPIRES_IN=7d
SALT_ROUNDS=12

# Cookie settings for production
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# CORS: Update after frontend is deployed
FRONTEND_ORIGIN=http://localhost:3000

# Database pooling
PG_POOL_MAX=20
PG_IDLE_TIMEOUT_MS=30000
PG_CONN_TIMEOUT_MS=2000
```

**⚠️ CRITICAL: Generate secure JWT_SECRET**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Verify Procfile

Backend must have `Procfile` in root (already included):

```
web: node src/server.js
release: npm run migrate up
```

This ensures migrations run on deploy.

### Step 6: Deploy Backend

1. In Railway dashboard, select your project
2. Click **"Deploy"** or auto-deploys if set up
3. Watch logs in **"Deployments"** tab
4. Wait for ✅ "Deployment Successful"

**Expected Logs:**
```
Building application...
Installing dependencies...
Building complete
Starting...
Server running on port 4000
```

### Step 7: Get Backend URL

After successful deployment:

1. Click on **"backend"** service
2. Click **"Settings"** tab
3. Under **"Domains"**, you'll see public URL like: `https://backend-production.railway.app`
4. **Copy this URL** - you'll need it for frontend configuration

**Test Your Backend:**
```bash
curl https://YOUR_RAILWAY_BACKEND_URL/health/db

# Should return:
# {"status":"ok","database":"connected",...}
```

---

<a name="vercel-frontend"></a>
## ⚡ Frontend Deployment (Vercel)

### Step 1: Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"From Git Repository"**
3. Paste your GitHub repo: `https://github.com/YOUR_USERNAME/devflx-attendance`
4. Click **"Import"**

### Step 2: Configure Project

When Vercel shows configuration screen:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Project Name** | devflx-attendance |
| **Root Directory** | `frontend` (IMPORTANT!) |
| **Install Command** | `npm install` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |

### Step 3: Add Environment Variables

In the configuration screen, click **"Environment Variables"** section:

Add this variable:
```
NEXT_PUBLIC_API_URL = http://localhost:4000
```

⚠️ **Keep as localhost:4000 for now** - we'll update after backend is deployed.

### Step 4: Deploy to Vercel

1. Click **"Deploy"**
2. Watch deployment progress
3. Wait for ✅ "Deployment Complete"

**Expected result:** Vercel provides a URL like `https://devflx-attendance.vercel.app`

### Step 5: Update Vercel Environment Variable

After backend is deployed and you have the Railway URL:

1. Go to Vercel Dashboard → Your Project → **"Settings"**
2. Click **"Environment Variables"** (left sidebar)
3. Find `NEXT_PUBLIC_API_URL`
4. Edit it and change to:
   ```
   NEXT_PUBLIC_API_URL = https://YOUR_RAILWAY_BACKEND_URL
   ```
5. Click **"Save"**

### Step 6: Redeploy Frontend

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on latest deployment
3. Select **"Redeploy"**
4. Wait for deployment to complete

✅ **Frontend is now connected to backend!**

---

<a name="connection"></a>
## 🔗 Connect Frontend to Backend

### Update Backend CORS Setting

Now that frontend is on Vercel, update backend's `FRONTEND_ORIGIN`:

**In Railway Dashboard:**
1. Select **backend** service
2. Click **"Variables"**
3. Find `FRONTEND_ORIGIN`
4. Update to:
   ```
   FRONTEND_ORIGIN=https://devflx-attendance.vercel.app
   ```
5. Save and Railway auto-redeploys

**Or allow multiple origins:**
```
FRONTEND_ORIGIN=https://devflx-attendance.vercel.app,http://localhost:3000
```

### Test the Connection

1. Visit your Vercel frontend: `https://devflx-attendance.vercel.app`
2. Click **"Login"** button
3. Enter test credentials
4. Open **Browser DevTools** → **Network** tab
5. Look for API calls to your Railway backend URL
6. Should see ✅ `200 OK` responses

**If you see CORS errors:**
- Check `FRONTEND_ORIGIN` in Railway backend
- Check `NEXT_PUBLIC_API_URL` in Vercel frontend
- Ensure both URLs are exactly correct (https://, no trailing slash)

---

<a name="env-checklist"></a>
## 📋 Environment Variables Checklist

### Railway Backend Variables Required

```
✅ Auto-populated by Railway:
   - DATABASE_URL (from PostgreSQL service)
   - REDIS_URL (from Redis service, if added)

✅ You must set:
   - NODE_ENV = production
   - PORT = 4000
   - JWT_SECRET = [generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   - JWT_EXPIRES_IN = 7d
   - SALT_ROUNDS = 12
   - FRONTEND_ORIGIN = https://your-vercel-url.vercel.app
   - LOG_LEVEL = info
   - COOKIE_SECURE = true
   - COOKIE_SAME_SITE = strict
```

### Vercel Frontend Variables Required

```
✅ Required:
   - NEXT_PUBLIC_API_URL = https://your-railway-backend-url

ℹ️ Optional (advanced):
   - NEXT_PUBLIC_APP_ENV = production
   - NEXT_PUBLIC_LOG_LEVEL = info
```

---

<a name="verification"></a>
## ✔️ Verification & Testing

### 1. Backend Health Check

```bash
# Get your Railway backend URL from dashboard
BACKEND_URL="https://your-railway-backend.railway.app"

# Test health endpoint
curl "$BACKEND_URL/health/db"

# Expected response:
# {"status":"ok","database":"connected",...}
```

### 2. Frontend Build Check

```bash
# Visit your Vercel URL
curl https://your-vercel-url.vercel.app

# Should return HTML (status 200)
```

### 3. API Connection Test

1. Open frontend in browser
2. Press F12 to open DevTools
3. Go to **Network** tab
4. Reload page and look for API calls
5. All calls should be to your Railway backend URL
6. Should see ✅ `200 OK` responses

### 4. Login Test

1. Click **"Login"** button
2. Try to login with test account
3. Should load dashboard without API errors
4. Check DevTools → **Console** for any errors

### 5. Feature Tests

- **Employees Page:** Load employee list (fetches from backend API)
- **Attendance History:** View attendance records
- **Dashboard:** Load charts and statistics
- **User Management:** Create/update users (if admin)

---

<a name="troubleshooting"></a>
## 🔧 Troubleshooting

### Problem: Frontend shows "Failed to fetch" errors

**Checklist:**
1. Is backend URL correct in Vercel? `NEXT_PUBLIC_API_URL`
2. Is backend running in Railway? Check deployment logs
3. Do URLs match exactly? (protocol, domain, no trailing slash)
4. Is CORS configured? Check `FRONTEND_ORIGIN` in Railway

**Fix:**
```bash
# Test backend directly
curl https://YOUR_RAILWAY_URL/health/db

# If that fails, check Railway logs:
# Railway Dashboard → Select backend → Click "Logs" tab
```

### Problem: "CORS policy: blocked" error

**This happens when:**
- `FRONTEND_ORIGIN` in backend doesn't match frontend URL
- CORS not properly configured

**Fix:**
```bash
# Update in Railway backend variables:
FRONTEND_ORIGIN=https://your-vercel-url.vercel.app

# Then Railway auto-redeploys (wait 30 seconds)
# Refresh frontend page
```

### Problem: Database connection errors in logs

**This means:**
1. PostgreSQL database not connected
2. `DATABASE_URL` not set in Railway

**Fix:**
1. Go to Railway → Check PostgreSQL service exists
2. Click PostgreSQL service → Check Variables tab
3. Should see `DATABASE_URL` populated
4. If missing, delete service and recreate

### Problem: 502 Bad Gateway on Vercel

**This means:**
1. Frontend built but can't reach backend
2. Backend is down or URL is wrong

**Fix:**
```bash
# 1. Check backend is running:
curl https://YOUR_RAILWAY_URL/health/db

# 2. Check frontend env var:
# Vercel Dashboard → Settings → Environment Variables
# Verify NEXT_PUBLIC_API_URL is correct

# 3. Redeploy frontend:
# Deployments tab → ... menu → Redeploy
```

### Problem: Can't deploy to Railway

**Procfile issues:**
```bash
# Make sure Procfile exists in backend root:
cat backend/Procfile

# Should show:
# web: node src/server.js
# release: npm run migrate up
```

**package.json issues:**
```bash
# Verify scripts exist:
cat backend/package.json | grep -A 5 '"scripts"'

# Should include: start, dev, migrate
```

---

## 📞 Support Links

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment/vercel
- **Node.js on Railway:** https://docs.railway.app/guides/nodejs

---

## ✨ You're Done!

After completing all steps:
- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Railway  
- ✅ Database (PostgreSQL) on Railway
- ✅ Frontend and Backend connected
- ✅ All environment variables configured
- ✅ Ready for production traffic

**Your app is now live and accessible worldwide!**
