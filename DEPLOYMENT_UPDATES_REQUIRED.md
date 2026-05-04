# Configuration Updates for Railway & Vercel Deployment

## 📋 Complete Checklist: What Needs to Be Updated

### ✅ Backend (Railway) - What Needs to be Updated

#### 1. **Environment Variables**
```bash
Status: ✅ READY
File: .env.example (already exists)
Action: Verify all variables are documented

Required variables for Railway:
✓ NODE_ENV=production
✓ PORT=4000
✓ JWT_SECRET (generate new)
✓ JWT_EXPIRES_IN=7d
✓ SALT_ROUNDS=12
✓ FRONTEND_ORIGIN (update with Vercel URL)
✓ DATABASE_URL (auto-provided by Railway)
✓ REDIS_URL (auto-provided if Redis added)
✓ COOKIE_SECURE=true
✓ COOKIE_SAME_SITE=strict
```

#### 2. **Procfile**
```bash
Status: ✅ READY
File: backend/Procfile
Content Check:
✓ web: node src/server.js
✓ release: npm run migrate up

Action: No changes needed (already correct)
```

#### 3. **package.json**
```bash
Status: ✅ READY
File: backend/package.json
Required scripts:
✓ "start": "node src/server.js"  
✓ "dev": "node scripts/free-port.js && nodemon src/server.js"
✓ "migrate": "db-migrate" 

Action: No changes needed (all present)
```

#### 4. **CORS Configuration**
```bash
Status: ⚠️ NEEDS UPDATE
File: backend/src/app.js (line 51-54)
Current:
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000'
  
Action: ✓ Already using env variable!
         Just update FRONTEND_ORIGIN in Railway after frontend deploys
```

#### 5. **Database Connection**
```bash
Status: ✅ READY
File: backend/src/config/database.js (or similar)
Uses: process.env.DATABASE_URL

Action: No changes needed
        Railway provides DATABASE_URL automatically
```

#### 6. **Redis Connection** (if using cache)
```bash
Status: ✅ READY
File: backend/src/config/redis.js (if exists)
Uses: process.env.REDIS_URL

Action: No changes needed
        Railway provides REDIS_URL automatically
```

---

### ✅ Frontend (Vercel) - What Needs to be Updated

#### 1. **next.config.js**
```bash
Status: ✅ READY
File: frontend/next.config.js
Current Setup:
✓ Uses NEXT_PUBLIC_API_URL env variable
✓ Has rewrites for /api routes
✓ Has proper headers for security

Action: No changes needed!
```

#### 2. **Environment Variables**
```bash
Status: ⚠️ NEEDS UPDATE (after backend deployed)
File: Set in Vercel dashboard UI
Current: NEXT_PUBLIC_API_URL=http://localhost:4000
Update: NEXT_PUBLIC_API_URL=https://your-railway-backend-url

When: After backend is deployed to Railway
How: Environment Variables section in Vercel Settings
```

#### 3. **API Request Configuration**
```bash
Status: ✅ READY
Files: Any fetch() calls in frontend
Current: Uses process.env.NEXT_PUBLIC_API_URL

Example:
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
fetch(`${apiUrl}/api/auth/login`)

Action: No changes needed - already correct!
```

#### 4. **package.json**
```bash
Status: ✅ READY
File: frontend/package.json
Required scripts:
✓ "dev": "next dev"
✓ "build": "next build"
✓ "start": "next start"

Action: No changes needed
```

#### 5. **TypeScript Configuration**
```bash
Status: ✅ READY
File: frontend/tsconfig.json
Has: Proper Next.js TypeScript setup

Action: No changes needed
```

---

## 🔄 Configuration Flow: Step by Step

### Phase 1: Prepare Local Environment

- [ ] Update `backend/.env` with JWT_SECRET:
  ```bash
  JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  ```

- [ ] Test backend runs locally:
  ```bash
  cd backend
  npm run dev
  # Should see: Server running on port 4000
  ```

- [ ] Test frontend runs locally:
  ```bash
  cd frontend
  npm run dev
  # Should see: ready on http://localhost:3000
  ```

- [ ] Test login works locally:
  ```bash
  # Open http://localhost:3000 → Click Login
  # Should see login page, API calls to localhost:4000
  ```

### Phase 2: Setup Railway Backend

- [ ] Create Railway project
- [ ] Add GitHub integration
- [ ] Add PostgreSQL database
- [ ] Set environment variables in Railway:
  ```
  NODE_ENV=production
  PORT=4000
  JWT_SECRET=[generate new secure value]
  JWT_EXPIRES_IN=7d
  SALT_ROUNDS=12
  FRONTEND_ORIGIN=http://localhost:3000 (temporary)
  COOKIE_SECURE=true
  COOKIE_SAME_SITE=strict
  ```
- [ ] Deploy and get URL: `https://backend-xxxxx.railway.app`
- [ ] Test: `curl https://backend-xxxxx.railway.app/health/db`

### Phase 3: Setup Vercel Frontend

- [ ] Import project to Vercel
- [ ] Set root directory to `frontend/`
- [ ] Set environment variable:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:4000
  ```
- [ ] Deploy and get URL: `https://your-project.vercel.app`

### Phase 4: Connect Frontend to Backend

- [ ] In Railway, update `FRONTEND_ORIGIN`:
  ```
  FRONTEND_ORIGIN=https://your-project.vercel.app
  ```
  (Railway auto-redeploys)

- [ ] In Vercel, update `NEXT_PUBLIC_API_URL`:
  ```
  NEXT_PUBLIC_API_URL=https://backend-xxxxx.railway.app
  ```
  
- [ ] Redeploy frontend in Vercel

- [ ] Test login flow:
  ```
  Visit https://your-project.vercel.app
  Click Login → Enter credentials
  Check DevTools → Network for API calls to Railway URL
  Should see ✅ 200 responses
  ```

---

## 📋 What's Already Configured (No Changes Needed)

### Backend Files ✅
```
✅ backend/Procfile
   - Has correct commands for Railway
   
✅ backend/package.json
   - Has start, dev, migrate scripts
   
✅ backend/src/app.js
   - Uses FRONTEND_ORIGIN env variable for CORS
   
✅ backend/src/config/*
   - Uses DATABASE_URL env variable
   - Uses REDIS_URL if configured
   
✅ backend/.env.example
   - Documents all required variables
```

### Frontend Files ✅
```
✅ frontend/next.config.js
   - Uses NEXT_PUBLIC_API_URL env variable
   - Has proper rewrites for API calls
   - Has security headers configured
   
✅ frontend/package.json
   - Has build and start scripts
   
✅ frontend/tsconfig.json
   - TypeScript properly configured
   
✅ frontend/.env.example
   - Documents NEXT_PUBLIC_API_URL
```

### Docker Files ✅
```
✅ backend/Dockerfile
   - Configured for Node.js
   - Can be used for local testing with Docker
   
✅ backend/.dockerignore
   - Properly excludes node_modules
```

---

## ⚠️ Things That Will Change (After Deployment)

### After Railway Deployment:
- `FRONTEND_ORIGIN` in Railway (update to Vercel URL)
- Backend public URL (provided by Railway)

### After Vercel Deployment:
- `NEXT_PUBLIC_API_URL` in Vercel (update to Railway URL)
- Frontend public URL (provided by Vercel)

---

## 🔐 Security Checklist

### Backend Security
- [ ] JWT_SECRET is strong (32 bytes random)
- [ ] COOKIE_SECURE=true in production
- [ ] COOKIE_SAME_SITE=strict
- [ ] NODE_ENV=production
- [ ] No secrets hardcoded in code
- [ ] .env file not committed to git
- [ ] FRONTEND_ORIGIN matches actual frontend URL

### Frontend Security
- [ ] No secrets or tokens in frontend code
- [ ] API_URL is HTTPS in production
- [ ] No API keys exposed in frontend
- [ ] next.config.js has security headers
- [ ] Content-Security-Policy headers set
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection enabled

---

## 🚀 Pre-Deployment Checklist

### Code Quality
- [ ] No console.log() statements with sensitive data
- [ ] No TODO or FIXME comments about security
- [ ] All imports resolved (no broken imports)
- [ ] No hardcoded localhost URLs (except localhost:3000)
- [ ] All environment variables documented
- [ ] Procfile executable (chmod +x or Railway handles)

### Build Verification
```bash
# Backend
cd backend
npm install
npm run build  # If applicable

# Frontend
cd frontend
npm install
npm run build  # Should complete without errors
```

### Local Testing
```bash
# Start backend
cd backend && npm run dev

# In new terminal, start frontend
cd frontend && npm run dev

# Test at http://localhost:3000
# Try login, verify API calls work
```

---

## 📞 Quick Reference Table

| Component | Current Status | What to Update | When |
|-----------|---|---|---|
| Backend CORS | ✅ Uses env var | `FRONTEND_ORIGIN` | After Vercel deploys |
| Backend DB | ✅ Uses env var | Nothing (Railway provides) | N/A |
| Frontend Config | ✅ Uses env var | `NEXT_PUBLIC_API_URL` | After Railway deploys |
| Procfile | ✅ Ready | Nothing | N/A |
| package.json | ✅ Has scripts | Nothing | N/A |
| Environment Docs | ✅ Complete | Refer to templates | Throughout |

---

## 🎯 Summary: What You Need to Do

### Nothing to change in code! ✅

All configuration is already using environment variables.

**What you DO need to do:**

1. **Set Railway environment variables** (one-time setup)
2. **Set Vercel environment variable** (one-time setup)
3. **Update FRONTEND_ORIGIN in Railway** (after Vercel URL known)
4. **Update NEXT_PUBLIC_API_URL in Vercel** (after Railway URL known)
5. **Redeploy frontend** (to apply new API URL)

That's it! The infrastructure is deployment-ready. 🚀
