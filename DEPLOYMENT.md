# Deployment Guide - DevFlx Attendance System

This guide will help you deploy the DevFlx Attendance System with the frontend on **Vercel** and the backend on **Railway**.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Backend Deployment on Railway](#backend-deployment-on-railway)
- [Frontend Deployment on Vercel](#frontend-deployment-on-vercel)
- [Environment Variables Setup](#environment-variables-setup)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

1. A GitHub account with this repository pushed to it
2. A [Railway.app](https://railway.app) account
3. A [Vercel](https://vercel.com) account
4. PostgreSQL database (Railway provides this option)
5. Generated JWT secret key (for backend)

---

## Backend Deployment on Railway

### Step 1: Create a PostgreSQL Database on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"+ New Project"** → **"Database"** → **"PostgreSQL"**
3. Railway will create a PostgreSQL instance
4. Copy the `DATABASE_URL` from the PostgreSQL plugin's variables

### Step 2: Deploy Backend Project

1. In Railway Dashboard, click **"+ New"** → **"GitHub Repo"** (or deploy from CLI)
2. Select this repository
3. Select the repository scope and authorize
4. Railway will auto-detect the `Procfile` in the backend directory
5. Configure the service:
   - Name it "backend" or "devflx-backend"
   - Ensure the root directory is set to `backend/` (if Railway doesn't auto-detect)

### Step 3: Configure Environment Variables on Railway

In the Railway Dashboard, go to your backend service and set these variables:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
PORT=4000
NODE_ENV=production
FRONTEND_ORIGIN=https://your-frontend-vercel-url.vercel.app
JWT_SECRET=your_secure_random_jwt_secret_here
JWT_EXPIRES_IN=7d
SALT_ROUNDS=10
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
```

**Important:** 
- Generate a strong `JWT_SECRET` (at least 32 characters)
- Set `FRONTEND_ORIGIN` to your Vercel frontend URL after deploying it
- The `DATABASE_URL` from PostgreSQL plugin should already be available

### Step 4: Verify Backend Deployment

1. Railway will build and deploy automatically
2. Your backend will be accessible at: `https://[backend-name].railway.app`
3. Test the health endpoint: `https://[backend-name].railway.app/health`

---

## Frontend Deployment on Vercel

### Step 1: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Project Name:** devflx-frontend (or your choice)
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend/`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

### Step 2: Configure Environment Variables on Vercel

Before deploying, add environment variables:

1. In the Vercel project setup, scroll to **"Environment Variables"**
2. Add this variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
   ```

3. Replace `your-railway-backend-url` with your actual Railway backend domain

### Step 3: Complete Deployment

1. Click **"Deploy"**
2. Vercel will build and deploy automatically
3. Your frontend will be accessible at: `https://your-project.vercel.app`

---

## Environment Variables Setup

### Backend (.env.example → .env on production)

Reference: [backend/.env.example](./backend/.env.example)

Key variables:
- `DATABASE_URL`: PostgreSQL connection string from Railway
- `FRONTEND_ORIGIN`: Your Vercel frontend URL (with https://)
- `JWT_SECRET`: Strong random string for token signing
- `PORT`: Should be `4000` (Vercel handles port mapping)
- `NODE_ENV`: Set to `production`

### Frontend (.env example → .env.local on production)

Reference: [frontend/.env.example](./frontend/.env.example)

Key variables:
- `NEXT_PUBLIC_API_URL`: Your Railway backend URL (e.g., `https://backend-xyz.railway.app`)

**Note:** Any variable prefixed with `NEXT_PUBLIC_` will be exposed to the browser (don't put secrets there).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Your Domain / User Browser                     │
│                                                 │
└────────────────────┬────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
    ┌─────▼──────────┐    ┌────▼──────────┐
    │                │    │                │
    │  Vercel CDN    │    │  Railway API   │
    │  (Frontend)    │    │  (Backend)     │
    │                │    │                │
    │ - Next.js App  │    │ - Express.js   │
    │ - Static build │    │ - Node.js      │
    │                │    │                │
    └────────────────┘    └────┬───────────┘
                               │
                        ┌──────▼──────────┐
                        │                 │
                        │  PostgreSQL DB  │
                        │  (Railway)      │
                        │                 │
                        └─────────────────┘
```

---

## Post-Deployment Verification

### 1. Test Backend Health

```bash
curl https://your-backend-domain.railway.app/health
```

Expected response: `{"ok":true}`

### 2. Test Frontend

Visit `https://your-frontend.vercel.app` in your browser

### 3. Test Authentication Flow

1. Navigate to the Login/Signup page
2. Try creating an account
3. Verify that the request goes to your Railway backend
4. Check that cookies/tokens are stored correctly

### 4. Check Console for Errors

1. Open DevTools (F12) in your browser
2. Check the Console tab for any errors
3. Check the Network tab to verify API calls are going to your Railway backend

---

## Troubleshooting

### Issue: Frontend can't connect to backend

**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Check that your Railway backend is running (check Railway dashboard)
3. Ensure `FRONTEND_ORIGIN` on Railway matches your Vercel URL
4. Check CORS settings in `backend/src/app.js`

### Issue: 404 errors on Vercel

**Solution:**
1. Ensure root directory is set to `frontend/` in Vercel settings
2. Rebuild the project: go to Vercel project → Deployments → click latest → "Redeploy"

### Issue: Database connection errors on Railway

**Solution:**
1. Verify `DATABASE_URL` is correctly set in Railway
2. Check that PostgreSQL is running in Railway dashboard
3. Verify all required database tables exist (run migrations if needed)

### Issue: Authentication failing

**Solution:**
1. Verify `JWT_SECRET` is set on Railway
2. Check `COOKIE_SECURE` is `true` on production
3. Verify `FRONTEND_ORIGIN` matches your Vercel URL exactly

### Issue: CORS errors

**Solution:**
1. Check `FRONTEND_ORIGIN` environment variable on Railway
2. Ensure it includes the protocol (https://)
3. Add your Vercel domain to Railway if using allowlist

---

## Updating Deployments

### To update the backend:
1. Push changes to GitHub
2. Railway will automatically trigger a rebuild (if auto-deploy is enabled)
3. Monitor the deployment in Railway Dashboard

### To update the frontend:
1. Push changes to GitHub
2. Vercel will automatically trigger a rebuild
3. Monitor the deployment in Vercel Dashboard

---

## Database Migrations on Railway

If you need to run migrations on Railway:

1. Connect to your Railway PostgreSQL instance using a database client
2. Or use Railway CLI: `railway run npm run migrate`

---

## Performance Optimization Tips

### Backend (Railway)
- Use environment variables for configuration
- Enable compression (already in `app.js`)
- Monitor logs in Railway Dashboard

### Frontend (Vercel)
- Images are optimized via `next.config.js`
- Static generation is enabled for pages
- Vercel handles CDN automatically

---

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Express.js on Railway](https://docs.railway.app/guides/express)

---

## Support

For issues:
1. Check the Troubleshooting section above
2. Review logs in Railway Dashboard (backend)
3. Review logs in Vercel Dashboard (frontend)
4. Check GitHub Issues if available

---

**Last Updated:** April 30, 2026
