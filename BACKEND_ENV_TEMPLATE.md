# Backend Environment Variables Template

## For Railway Production Deployment

Copy and paste these variables into Railway dashboard → Backend Service → Variables → Raw Editor

### PostgreSQL (Auto-populated by Railway)
```env
# Railway PostgreSQL service auto-provides this
# No manual action needed
# DATABASE_URL=postgresql://user:password@host:port/database
```

### Redis (Auto-populated by Railway if you added it)
```env
# Railway Redis service auto-provides this
# No manual action needed
# REDIS_URL=redis://:password@host:port
```

### Server Configuration
```env
NODE_ENV=production
PORT=4000
LOG_LEVEL=info
PG_POOL_MAX=20
PG_IDLE_TIMEOUT_MS=30000
PG_CONN_TIMEOUT_MS=2000
```

### Security & Authentication
```env
# CRITICAL: Generate secure JWT_SECRET
# Run this command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Then paste the output below
JWT_SECRET=<your-secure-random-string-here>

JWT_EXPIRES_IN=7d
SALT_ROUNDS=12

# Cookie settings
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
```

### Frontend Connection
```env
# Update this with your Vercel frontend URL after deployment
# Format: https://your-project.vercel.app
FRONTEND_ORIGIN=http://localhost:3000
```

---

## Complete .env Template for Railway

```env
# Server
NODE_ENV=production
PORT=4000
LOG_LEVEL=info

# Database (auto-populated by Railway)
# DATABASE_URL=postgresql://...

# Redis (auto-populated by Railway if added)
# REDIS_URL=redis://...

# JWT
JWT_SECRET=generate-with-node-command
JWT_EXPIRES_IN=7d

# Password
SALT_ROUNDS=12

# Cookies
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# CORS
FRONTEND_ORIGIN=https://your-vercel-url.vercel.app

# Database Pool
PG_POOL_MAX=20
PG_IDLE_TIMEOUT_MS=30000
PG_CONN_TIMEOUT_MS=2000
```

---

## How to Generate JWT_SECRET

Run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

Copy and paste this value as `JWT_SECRET` in Railway.

---

## Steps to Update Variables in Railway

1. Go to Railway Dashboard → Your Project
2. Click on "backend" service (or your Node.js service)
3. Click "Variables" tab
4. Click "Raw Editor" button (or "Add Variable")
5. Copy above template
6. Paste all variables at once  
7. Under each variable, ensure:
   - ✅ "Production" environment is selected (if using environments)
8. Click "Save" or "Deploy"

---

## Variables That Auto-Populate (Don't Touch)

These are provided by Railway automatically:

- `DATABASE_URL` → from PostgreSQL service
- `REDIS_URL` → from Redis service (optional)

**Verify they exist:**
1. Go to PostgreSQL service
2. Click "Variables" tab  
3. Should see `DATABASE_URL` with full connection string
4. Copy-paste this into a note if you want to test locally

---

## Testing Before Production

```bash
# Test JWT_SECRET generation locally
node -e "console.log('JWT_SECRET generated:', require('crypto').randomBytes(32).toString('hex'))"

# Test Node environment
node -e "console.log('Node version:', process.version)"

# Test database connection (after deploying to Railway)
npm run dev
# Should connect successfully without errors
```

---

## Security Notes

🔒 **Important Security Practices:**

1. **JWT_SECRET** - Generate a new one for production (not local dev secret)
2. **SALT_ROUNDS** - Keep at 12 for production (balances security + performance)
3. **COOKIE_SECURE=true** - HTTPS only cookies
4. **COOKIE_SAME_SITE=strict** - CSRF protection
5. **Never commit .env files** - Check .gitignore has `.env`

---

## Monitoring Health

After deploying, monitor these:

```
✅ Database Connection
   Endpoint: /health/db
   Should return: {"status":"ok","database":"connected"}

✅ Server Response Time
   Monitor: X-Response-Time header
   Target: < 200ms average

✅ Error Rate
   Check: logs in Railway dashboard
   Target: < 1% 5xx errors

✅ Active Connections
   Railway shows: Deployment stats
   Target: < PG_POOL_MAX connections
```

---

## Rollback Plan

If something goes wrong in production:

1. **Option A (Quick Rollback):**
   - Railway Deployments tab
   - Select previous deployment
   - Click "Redeploy"

2. **Option B (Fix and Redeploy):**
   - Fix issue in code
   - Push to GitHub
   - Railway auto-deploys (if set up)

3. **Option C (Update Variables Only):**
   - Adjust environment variables
   - Click "Save"
   - Railway auto-redeploys with new env

---

## Need More Info?

- [Complete Deployment Guide](./COMPLETE_DEPLOYMENT_GUIDE.md)
- [Railway Deployment Checklist](./RAILWAY_DEPLOYMENT_CHECKLIST.md)
- [Railway Official Docs](https://docs.railway.app)
