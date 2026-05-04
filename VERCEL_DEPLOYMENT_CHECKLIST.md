# Vercel Frontend Deployment Checklist

## ✅ Pre-Deployment Checklist

### Repository Setup
- [ ] Code pushed to GitHub repository
- [ ] Frontend is in `frontend/` directory
- [ ] `.env.example` file exists in frontend root
- [ ] `.env.local` file is NOT committed (check `.gitignore`)
- [ ] `package.json` exists with `build` and `start` scripts
- [ ] `next.config.js` exists with proper configuration
- [ ] `tsconfig.json` exists if using TypeScript

### Code Quality
- [ ] No hardcoded API URLs - all use `NEXT_PUBLIC_API_URL`
- [ ] No hardcoded secrets in code
- [ ] All API calls use environment variables
- [ ] No console errors in local build: `npm run build`
- [ ] Local build succeeds: `npm run build`
- [ ] Tested locally: `npm run dev` works perfectly

### Build Verification
```bash
cd frontend
npm install
npm run build    # Should complete without errors
npm run start    # Should run on port 3000
```

### Environment Variables Ready
- [ ] `NEXT_PUBLIC_API_URL` documented
- [ ] Know where backend will be deployed
- [ ] All required env vars listed in `.env.example`

---

## ⚡ Vercel Deployment Steps

### Step 1: Prepare Vercel Account
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Create account (GitHub login recommended)
- [ ] Authorize Vercel to access your GitHub account

### Step 2: Import Project
- [ ] Visit [vercel.com/new](https://vercel.com/new)
- [ ] Click "From Git Repository"
- [ ] Search and select your repository
- [ ] Click "Import"

### Step 3: Configure Project Settings
When Vercel shows configuration screen:

**Basic Settings:**
- [ ] **Framework:** Select "Next.js" (auto-detected)
- [ ] **Project Name:** `devflx-attendance`
- [ ] **Root Directory:** ✅ **IMPORTANT** - Select `frontend/`
- [ ] **Build Command:** Keep default `npm run build`
- [ ] **Output Directory:** Keep default `.next`
- [ ] **Install Command:** Keep default `npm install`

### Step 4: Add Environment Variables
- [ ] Click "Environment Variables" section
- [ ] Add variable:
  ```
  Name: NEXT_PUBLIC_API_URL
  Value: http://localhost:4000
  ```
  ℹ️ We'll update this after backend is deployed
  
- [ ] Click "Add Another" if needed for more variables
- [ ] All variables should be visible

### Step 5: Deploy Frontend
- [ ] Review all settings
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (2-5 minutes)
- [ ] Watch for ✅ "Deployment Complete" message

### Step 6: Get Frontend URL
- [ ] Click "Visit" button or note the URL
- [ ] Format: `https://your-project.vercel.app`
- [ ] Save this URL for backend configuration ✓

### Step 7: Test Initial Deployment
- [ ] Visit the Vercel URL in browser
- [ ] Page should load (may show loading if API not ready)
- [ ] No build errors in browser console (yet - API not connected)

---

## 🔗 After Backend is Deployed (Railway)

### Step 1: Get Backend URL from Railway
- [ ] From Railway dashboard
- [ ] Copy the backend service public URL
- [ ] Format: `https://backend-xxxxx.railway.app`

### Step 2: Update Environment Variable in Vercel
- [ ] Go to Vercel Dashboard → Your Project
- [ ] Click "Settings" (top menu)
- [ ] Click "Environment Variables" (left sidebar)
- [ ] Find `NEXT_PUBLIC_API_URL`
- [ ] Click to edit
- [ ] Change value from `http://localhost:4000` to `https://YOUR_RAILWAY_URL`
- [ ] Save ✓

### Step 3: Redeploy Frontend
- [ ] Go to "Deployments" tab
- [ ] Click the **...** menu on the latest deployment
- [ ] Select "Redeploy"
- [ ] Wait for deployment to complete
- [ ] Should see ✅ "Deployment Complete"

### Step 4: Test Connection
- [ ] Visit frontend URL: `https://your-project.vercel.app`
- [ ] Press F12 to open DevTools
- [ ] Go to **Network** tab
- [ ] Reload page
- [ ] Look for API calls to your Railway backend URL
- [ ] Should see responses with ✅ status 200 OK

### Step 5: Test Login Flow
- [ ] Click "Login" button
- [ ] Try to login with test credentials
- [ ] Should reach dashboard (or appropriate page)
- [ ] No "Failed to fetch" or CORS errors ✓

---

## 🔍 Post-Deployment Verification

### Frontend Builds Successfully
- [ ] Vercel deployment shows ✅ green status
- [ ] Build logs show no errors
- [ ] Frontend URL is accessible

### API Connection Works
- [ ] No "Failed to fetch" errors in browser console
- [ ] Network tab shows API calls to correct backend URL
- [ ] API responses are 200 OK, not 502/503

### Features Work
- [ ] Login page loads
- [ ] Logout works
- [ ] Dashboard loads and shows data
- [ ] Employee list loads (if applicable)
- [ ] Search/filter works

---

## 📊 Vercel Deployment Options

### Auto-Deployment (Recommended)
- Every push to `main` branch auto-deploys
- Preview deployments for pull requests
- Automatic rollback on failed builds

### Manual Deployment
- Deployments tab → Select deployment → "Redeploy"
- Useful for changing environment variables

### Custom Domain (Optional)
- After frontend is stable
- Settings → Domains → Add Domain
- Point DNS to Vercel nameservers

---

## ⚠️ Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Failed to fetch" errors | Backend URL wrong or down | Check NEXT_PUBLIC_API_URL in Vercel Settings |
| CORS errors | Backend FRONTEND_ORIGIN wrong | Update FRONTEND_ORIGIN in Railway backend |
| Build fails | Wrong root directory | Ensure "Root Directory" is set to `frontend/` |
| Deployment hangs | Waiting for database | Check backend is fully deployed first |
| Blank page | JavaScript error | Check browser console for errors |

---

## 🚀 Environment Variables Required

### In Vercel Settings:
```
NEXT_PUBLIC_API_URL = https://your-railway-backend-url

Optional (advanced):
NEXT_PUBLIC_APP_ENV = production
NEXT_PUBLIC_LOG_LEVEL = info
```

### Not in Vercel (backend-only):
```
These are handled by Railway, not Vercel:
- DATABASE_URL
- JWT_SECRET
- NODE_ENV
- etc.
```

---

## 📋 Useful Vercel Commands

```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy from terminal
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel status
```

---

## ✅ Pre-Production Checklist

Before going live:
- [ ] Frontend builds and deploys successfully
- [ ] Backend is deployed and responding
- [ ] Frontend can fetch data from backend
- [ ] Login/authentication works
- [ ] No console errors or warnings
- [ ] Mobile responsive looks good
- [ ] All features tested manually
- [ ] Performance is acceptable (check Vercel Analytics)

---

## 🎯 Ready for Production!

Once all checks pass, your frontend is ready to handle production traffic!

**For issues, refer to:**
- [COMPLETE_DEPLOYMENT_GUIDE.md](./COMPLETE_DEPLOYMENT_GUIDE.md)
- [RAILWAY_DEPLOYMENT_CHECKLIST.md](./RAILWAY_DEPLOYMENT_CHECKLIST.md)
