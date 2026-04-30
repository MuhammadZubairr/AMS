# Pre-Deployment Checklist

Use this checklist to ensure your project is ready for deployment to Vercel and Railway.

## Backend (Railway)

### Code & Configuration
- [ ] `backend/Dockerfile` exists and is properly configured
- [ ] `backend/Procfile` exists with `web: npm start`
- [ ] `backend/.dockerignore` exists
- [ ] `backend/package.json` has `"start": "node src/server.js"` script
- [ ] `backend/src/server.js` uses `process.env.PORT` with fallback
- [ ] Environment variables are documented in `backend/.env.example`

### Environment Variables (Set on Railway)
- [ ] `DATABASE_URL` → PostgreSQL connection string
- [ ] `PORT` → Set to 4000 (or Railway's assigned port)
- [ ] `NODE_ENV` → Set to `production`
- [ ] `JWT_SECRET` → Strong random string (32+ chars)
- [ ] `JWT_EXPIRES_IN` → Set to `7d` or your preference
- [ ] `SALT_ROUNDS` → Set to `10`
- [ ] `COOKIE_SECURE` → Set to `true`
- [ ] `COOKIE_SAME_SITE` → Set to `strict`
- [ ] `FRONTEND_ORIGIN` → Your Vercel frontend URL (e.g., `https://app.vercel.app`)

### Database
- [ ] PostgreSQL database created on Railway
- [ ] Initial migration has run (tables created)
- [ ] Database connection tested locally

### Health Check
- [ ] `/health` endpoint responds with `{"ok":true}`
- [ ] Error handling middleware is in place
- [ ] Logs are properly formatted

---

## Frontend (Vercel)

### Code & Configuration
- [ ] `frontend/package.json` has `"build": "next build"` script
- [ ] `frontend/next.config.js` exists with proper optimization
- [ ] `frontend/vercel.json` exists (optional but recommended)
- [ ] Environment variables documented in `frontend/.env.example`

### Environment Variables (Set on Vercel)
- [ ] `NEXT_PUBLIC_API_URL` → Your Railway backend URL (e.g., `https://backend-xyz.railway.app`)

### Code Quality
- [ ] All imports use correct paths
- [ ] No hardcoded API URLs (except `localhost:4000` in dev)
- [ ] `frontend/services/api.js` uses `NEXT_PUBLIC_API_URL`
- [ ] All environment-dependent code uses proper constants

### Build & Performance
- [ ] Local build works: `cd frontend && npm run build`
- [ ] No build warnings or errors
- [ ] Images optimized in `next.config.js`
- [ ] API calls use credentials: `include` for CORS

---

## Git & Repository

### Repository Setup
- [ ] `.gitignore` includes `node_modules/`, `.env`, `.next/`, etc.
- [ ] `.env` files are NOT committed (only `.env.example`)
- [ ] All changes committed and pushed to GitHub
- [ ] Repository is public or you have access granted to Vercel/Railway

### Secrets Management
- [ ] No secrets in code or `.env` committed to Git
- [ ] Secrets only exist in Railway/Vercel dashboards
- [ ] JWT_SECRET is generated and strong
- [ ] Database passwords are secure

---

## Testing Before Deployment

### Local Testing
- [ ] Backend runs locally: `npm run dev` in `backend/`
- [ ] Frontend runs locally: `npm run dev` in `frontend/`
- [ ] API calls work between frontend and backend
- [ ] Authentication flow works (signup, login, logout)
- [ ] No console errors or warnings

### Production Simulation
- [ ] Backend builds: `docker build -t backend .` in `backend/` directory
- [ ] Frontend builds: `npm run build` in `frontend/` directory
- [ ] All environment variables are accounted for

---

## Deployment Steps

### Step 1: Backend on Railway
- [ ] Create Railway account and PostgreSQL database
- [ ] Connect GitHub repository to Railway
- [ ] Set root directory to `backend/`
- [ ] Configure environment variables on Railway
- [ ] Verify backend URL works: `https://your-backend.railway.app/health`

### Step 2: Frontend on Vercel
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend/`
- [ ] Set `NEXT_PUBLIC_API_URL` to your Railway backend URL
- [ ] Deploy and verify frontend URL works

### Step 3: Integration Testing
- [ ] Update `FRONTEND_ORIGIN` on Railway backend with Vercel frontend URL
- [ ] Test full auth flow: signup → login → access protected pages
- [ ] Verify cookies/tokens are stored correctly
- [ ] Check browser Network tab for proper API endpoints

---

## Post-Deployment

- [ ] Frontend loads without errors
- [ ] Backend health check passes
- [ ] Authentication works end-to-end
- [ ] Database operations work (create, read, update, delete)
- [ ] CORS issues are resolved
- [ ] No console errors in browser
- [ ] Response times are acceptable

---

## Rollback Plan (if needed)

- [ ] Previous version is still accessible on another branch
- [ ] You can redeploy previous version from git history
- [ ] Database backups exist on Railway
- [ ] You have admin access to both services

---

## Documentation

- [ ] [DEPLOYMENT.md](./DEPLOYMENT.md) reviewed and understood
- [ ] Environment variables documented
- [ ] Team members informed of deployment
- [ ] Monitoring/logging configured if needed

---

## Additional Notes

- Keep `.env` files out of version control always
- Update `FRONTEND_ORIGIN` on Railway after Vercel deployment
- Test third-party integrations if any
- Set up error monitoring (e.g., Sentry) for production

---

**Status:** Ready for Deployment ✓
