# Deployment Guide - DevFlx Attendance System

This guide walks through deploying the performance-optimized DevFlx system to **Vercel** (frontend) and **Railway** (backend + database).

---

## Prerequisites

- Git repository (GitHub, GitLab, or Gitea)
- Vercel account (vercel.com)
- Railway account (railway.app)
- PostgreSQL database (Railway provides managed option)
- Redis instance (Railway provides managed option, or use Upstash)

---

## Part 1: Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Go to [vercel.com/import](https://vercel.com/import)
2. Select repository source (GitHub recommended)
3. Authorize Vercel to access your repo
4. Select the DevFlx repository

### Step 2: Configure Build Settings

**Project Settings:**
| Setting | Value |
|---------|-------|
| **Framework** | Next.js |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

**Keep defaults for:**
- Node.js version (uses 18.x by default)
- Environment setup

### Step 3: Add Environment Variables

Click **Environment Variables** in project settings:

```
NEXT_PUBLIC_API_URL = https://api.yourdomain.com
NEXT_PUBLIC_APP_ENV = production
```

**Important:** 
- Only variables prefixed with `NEXT_PUBLIC_` are exposed to frontend
- Backend API URL must be set correctly or API calls will fail

### Step 4: Deploy Frontend

1. Click **Deploy** button
2. Wait for build to complete (typically 3-5 minutes)
3. Vercel provides a `.vercel.app` URL automatically
4. Custom domain: Add in **Settings → Domains**

**After Deploy:**
```bash
# Verify frontend is responding
curl https://yourdomain.vercel.app/
# Should return HTML (status 200)
```

**Enable Analytics (Optional):**
- Vercel Analytics shows Core Web Vitals
- Settings → Analytics → Enable

---

## Part 2: Backend Deployment (Railway)

### Step 1: Create New Project

1. Go to [railway.app/dashboard](https://railway.app/dashboard)
2. Click **New Project**
3. Select **Deploy from GitHub**
4. Authorize Railway to access your repo
5. Select the DevFlx backend folder

### Step 2: Configure Build Settings

**Create `Procfile` if missing** (already in backend/):**
```
web: node src/server.js
release: npm run migrate up
```

**The release task runs migrations on every deploy** (critical for schema updates).

### Step 3: Add PostgreSQL Database

1. In Railway project dashboard, click **New** → **Database** → **PostgreSQL**
2. Creates a managed database automatically
3. Database connection string appears in environment as `DATABASE_URL`

**Verify in Variables:**
```
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

### Step 4: Add Redis Cache (Optional but Recommended)

1. In Railway project dashboard, click **New** → **Add Service** → **Redis**
2. Creates managed Redis instance
3. Connection string appears as `REDIS_URL`

**Verify in Variables:**
```
REDIS_URL=redis://:password@host:port
```

### Step 5: Configure Environment Variables

Click **Variables** tab and add:

```
NODE_ENV = production
PORT = 4000
LOG_LEVEL = info
JWT_SECRET = <generate-secure-random-string>
JWT_EXPIRES_IN = 1h
SALT_ROUNDS = 12
PG_POOL_MAX = 20
PG_IDLE_TIMEOUT_MS = 30000
PG_CONN_TIMEOUT_MS = 2000
```

**To generate JWT_SECRET securely:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output to Railway VARIABLES
```

### Step 6: Deploy Backend

1. Click **Deploy** on the project
2. Railway automatically detects `Procfile` and Node.js
3. Builds and deploys (typically 2-3 minutes)
4. Migration runs automatically (release phase)
5. Backend URL provided in Railway dashboard (e.g., `api-service.up.railway.app`)

**After Deploy:**
```bash
# Verify backend is responding
curl https://yourdomain-api.railway.app/health/db
# Should return: {"status":"ok","database":"connected",...}
```

### Step 7: Configure Health Checks (Optional)

In Railway **Settings → Health Check:**
```
Path: /health/db
Interval: 30s
Timeout: 5s
```

Railway auto-restarts if health check fails.

---

## Part 3: Connect Frontend to Backend

### Step 1: Update Frontend Environment Variable

After backend is deployed, get the API URL from Railway dashboard.

In Vercel project settings:
- **Settings → Environment Variables**
- Update `NEXT_PUBLIC_API_URL` to Railway backend URL:

```
NEXT_PUBLIC_API_URL = https://yourdomain-api.railway.app
```

### Step 2: Trigger Frontend Redeploy

- Vercel dashboard → **Deployments** → Select latest deployment
- Click **Redeploy**
- Wait for new build with updated API URL

**Test Connection:**
1. Open frontend: `https://yourdomain.vercel.app`
2. Attempt login
3. Check browser console (DevTools → Console) for API errors
4. If login works, backend ↔ frontend connection is live ✅

---

## Part 4: Custom Domain Setup

### Option A: Use Vercel's Domain Management

1. Vercel dashboard → **Settings → Domains**
2. Click **Add Domain**
3. Enter `yourdomain.com` and `api.yourdomain.com`
4. Switch nameservers to Vercel (instructions provided)

### Option B: Use Your Existing Registrar

**For Frontend (Vercel):**
1. Vercel dashboard → **Settings → Domains**
2. Add custom domain
3. Add CNAME record in your registrar:
   ```
   Name: yourdomain.com (or @)
   Type: CNAME
   Value: cname.vercel-dns.com
   ```

**For Backend (Railway):**
1. Railway dashboard → **Settings → Domain**
2. Add custom domain
3. Add CNAME record in your registrar:
   ```
   Name: api.yourdomain.com
   Type: CNAME
   Value: cname.railway.app (provided by Railway)
   ```

**Verify DNS Propagation:**
```bash
# DNS might take 5-30 minutes to propagate
nslookup yourdomain.com
nslookup api.yourdomain.com
```

---

## Part 5: SSL/HTTPS (Automatic)

- **Vercel:** Automatically issues SSL cert (free Let's Encrypt)
- **Railway:** Automatically issues SSL cert

**Verify HTTPS:**
```bash
curl -I https://youdomain.vercel.app
# Should show: HTTP/2 200
```

---

## Part 6: Environment-Specific Configurations

### Development Environment
```
NODE_ENV = development
LOG_LEVEL = debug
CORS_ORIGIN = http://localhost:3000
```

### Staging Environment
```
NODE_ENV = staging
LOG_LEVEL = info
CORS_ORIGIN = https://staging.yourdomain.com
```

### Production Environment
```
NODE_ENV = production
LOG_LEVEL = info (or warn)
CORS_ORIGIN = https://yourdomain.com
```

---

## Post-Deployment Verification

### 1. Frontend Health Check

```bash
# Check home page loads
curl https://yourdomain.vercel.app/ | head -20

# Check API endpoints are reachable (should NOT error 502)
curl https://yourdomain.vercel.app/_next/static/
```

### 2. Backend Health Check

```bash
# Health endpoint
curl https://api.yourdomain.com/health/db

# Should return:
# {"status":"ok","database":"connected",...}
```

### 3. Full Login Flow

1. Open app: `https://yourdomain.vercel.app`
2. Click Login
3. Enter test credentials
4. Should redirect to dashboard
5. Check Response Time header:
   ```bash
   curl -I https://api.yourdomain.com/api/auth/login
   # Look for: X-Response-Time-ms: <100
   ```

### 4. Database Connection

```bash
# From Railway dashboard
# Click PostgreSQL → Connect tab → Copy connection string

psql postgresql://user:pass@host:port/dbname

# Once connected, verify tables exist:
\dt

# Should show: users, attendance, leaves, notifications
```

### 5. Redis Health

```bash
# From Railway dashboard
# Click Redis → Logs

# In console, test:
redis-cli
> PING
# Should respond: PONG
```

---

## Monitoring & Troubleshooting

### Vercel Logs

```bash
# View live logs
vercel logs --follow

# View build logs
vercel logs --prod

# Search for errors
vercel logs | grep -i error
```

### Railway Logs

1. Railway dashboard → Select project
2. Click **Logs** tab
3. View real-time backend logs
4. Filter by service (PostgreSQL, Redis, Backend)

### Common Issues

**Issue: "502 Bad Gateway" on frontend**
- Backend not responding
- Cause: Health check failing, API URL wrong, or service crashed
- Fix: Check Railway logs, verify `REDIS_URL` is set correctly

**Issue: "Cannot GET /api/..." on backend**
- Route not found or not deployed
- Cause: Old code deployed, migration not run
- Fix: Check Procfile includes `release: npm run migrate up`

**Issue: "Database connection refused"**
- PostgreSQL down or wrong credentials
- Cause: DATABASE_URL wrong or DB not initialized
- Fix: Railway dashboard → PostgreSQL → Connect tab → copy URL again

**Issue: API calls timeout (>5 seconds)**
- DB queries slow or N+1 problem
- Cause: Index not created or cache not working
- Fix: Check `rails log table_info` for index status; verify Redis installed

**Issue: Redux/state not persisting on page reload**
- Cookie policy or session storage issue
- Cause: CORS not configured correctly
- Fix: Set `CORS_ORIGIN` in backend to match frontend domain

---

## Scaling Recommendations

### When to Scale

| Metric | Action |
|--------|--------|
| Average response time >200ms | Scale backend (add more instances) |
| CPU >80% on database | Read replicas for reports; write main DB |
| Memory >90% on Redis | Flush old cache; upgrade instance |
| Error rate >0.1% | Check logs; may need retries or circuit breaker |

### Horizontal Scaling (Multiple Backend Instances)

Railway handles this automatically on paid plans:
1. Railway dashboard → **Settings → Scale**
2. Increase replicas (each instance can handle ~500 concurrent users)
3. Railway load balances traffic automatically

### Database Optimization

If reports become slow:
1. Create materialized view in PostgreSQL for aggregations
2. Run `REFRESH MATERIALIZED VIEW` nightly (cron job)
3. Query view instead of real-time aggregation

---

## Backup & Disaster Recovery

### PostgreSQL Backups (Railway Managed)

- Railway automatically backups daily
- 7-day retention by default
- Restore: Railway dashboard → Database → Backups tab

**Verify backup exists:**
```bash
# Railway dashboard → PostgreSQL → Backups
# Should show daily snapshots
```

### Manual Backup

```bash
# Export database to file
pg_dump postgresql://user:pass@host/db > backup.sql

# Upload to cloud storage (S3, etc.)
# Keep for 30+ days rolling window
```

---

## Performance Monitoring

### Vercel Analytics

- Dashboard → **Analytics** tab
- Shows Core Web Vitals, response times, errors
- Free tier: Last 7 days
- Pro tier: Last 90 days

### Railway Metrics

- Dashboard → **Metrics** tab
- CPU, memory, disk, network graphs
- Real-time updates

### Custom Monitoring (Recommended for Production)

```bash
# Option 1: Sentry (error tracking)
npm install @sentry/node
# Add to backend: Sentry.init({ dsn: "SENTRY_DSN" })

# Option 2: DataDog (full observability)
# Install DataDog agent, connect Railway

# Option 3: New Relic (APM)
npm install newrelic
# Requires API key setup
```

---

## Rollback Procedure

### Frontend Rollback

```bash
# Vercel dashboard → Deployments
# Click on previous deployment
# Click "Promote to Production"
# Done! Previous version live within 30s
```

### Backend Rollback

1. Railway dashboard → Deployments
2. Click rollback button on previous deployment
3. Select confirm
4. Backend reverts to previous version (migration may revert too)

---

## Security Best Practices

1. **Never commit secrets** to Git
   - SSH keys, API keys, database passwords go in environment variables only
   - Use `.env.local` in development (git-ignored)

2. **Rotate JWT_SECRET periodically** (quarterly)
   - Old tokens will stop working after change
   - Plan for user re-login

3. **Enable 2FA on Vercel & Railway accounts**
   - Vercel: Settings → Security → Two-Factor Authentication
   - Railway: Settings → Security → Enable 2FA

4. **Use strong passwords for database & Redis**
   - Railway generates strong defaults
   - If changing manually, use 32+ character random strings

5. **Audit access logs**
   - Railway → Logs tab → search for `error` or `401/403`
   - Vercel → Deployments → failed builds indicate attempted unauthorized access

---

## Final Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Railway
- [ ] PostgreSQL database created & migrated
- [ ] Redis instance created (recommended)
- [ ] Environment variables set correctly
- [ ] CORS configured (backend & frontend URLs match)
- [ ] Domains configured (custom domain or use provided URLs)
- [ ] SSL/HTTPS working (check browser padlock)
- [ ] Login flow tested (frontend → backend → database)
- [ ] Health endpoints responding
- [ ] Logs being collected (Sentry/DataDog optional but recommended)
- [ ] Backups enabled
- [ ] Monitoring dashboard set up

---

**Estimated Time:** 30-45 minutes for full deployment  
**Cost:** ~$30-50/month for managed services (Vercel free tier + Railway $5-10/month)

Need help? Check Railway & Vercel docs or contact support.
