# Frontend Environment Variables Template

## For Vercel Production Deployment

### Required Variables

```env
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
```

⚠️ **IMPORTANT:** This must point to your Railway backend URL

---

## How to Add Variables in Vercel

### During Initial Deployment

1. When importing project to Vercel
2. Configuration screen appears  
3. Click "Environment Variables"
4. Add variables:
   ```
   NEXT_PUBLIC_API_URL = http://localhost:4000
   ```
5. Click "Deploy"

### After Deployment (Update)

1. Go to Vercel Dashboard
2. Select your project → **"Settings"** (top menu)
3. Click **"Environment Variables"** (left sidebar)
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL = https://your-railway-backend-url.railway.app
   ```
5. Click "Save"
6. Go to **"Deployments"** tab
7. Click **...** on latest deployment → **"Redeploy"**

---

## Frontend .env.local (For Local Development)

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_LOG_LEVEL=debug
```

**DO NOT commit** this file - add to `.gitignore`

---

## Variable Naming Conventions

### Variables Exposed to Frontend (Visible in Browser)
- Must start with `NEXT_PUBLIC_`
- Example: `NEXT_PUBLIC_API_URL`
- Visible in browser DevTools → Application → Environment

### Server-Only Variables (NOT exposed)
- Do NOT use `NEXT_PUBLIC_` prefix
- Example: `DATABASE_URL` (if needed in middleware)
- Only available at build time or in API routes

**All frontend variables should be prefixed with `NEXT_PUBLIC_`**

---

## Complete Frontend Env Template

### Minimal (Required)
```env
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
```

### Recommended
```env
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Advanced (Optional)
```env
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

---

## How Frontend Uses Environment Variables

### In Code:
```typescript
// Automatically available in Next.js
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Example: "https://backend-xxxxx.railway.app"

// Use in API calls
const response = await fetch(`${apiUrl}/api/auth/login`, {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### In next.config.js:
```javascript
// Already configured to use NEXT_PUBLIC_API_URL
env: {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
}
```

---

## Vercel Environment Variable GUI Steps

1. **Open Project Settings**
   - Vercel Dashboard → Select Project
   - Top menu → Click "Settings"

2. **Navigate to Environment Variables**
   - Left sidebar → "Environment Variables"

3. **Add or Edit Variable**
   - Click "Add New..." button
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-railway-backend-url.railway.app`
   - Choose **Environment:** "Production" (for live site)
   - Click "Save"

4. **Verify Variable Saved**
   - Should appear in list
   - Shows checkmark for saved

5. **Redeploy to Apply**
   - Go to **"Deployments"** tab
   - Find latest deployment
   - Click **...** menu
   - Click **"Redeploy"**
   - Wait for ✅ completion

---

## Testing Environment Variables

### Check Variable is Set
```bash
# During local development
echo $NEXT_PUBLIC_API_URL

# Should output: http://localhost:4000
```

### Verify in Vercel Build
1. Go to Vercel Deployments
2. Click deployment
3. Look for "Environment Variables" section in logs
4. Should show variables being used

### Test in Browser
```javascript
// Open DevTools → Console
// In a local dev environment:
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should print: http://localhost:4000 (or your Railway URL)

// In Vercel production:
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should print: https://your-railway-url
```

---

## Common Issues

### Issue: API calls fail with "Failed to fetch"

**Cause:** `NEXT_PUBLIC_API_URL` is wrong or backend is down

**Fix:**
1. Verify in Vercel Settings → Environment Variables
2. Correct URL format: `https://...railway.app` (no trailing slash)
3. Test backend directly: `curl https://YOUR_URL/health/db`
4. Redeploy frontend after fixing

### Issue: Build succeeds but API calls are to wrong URL

**Cause:** Variable not yet updated or need to rebuild

**Fix:**
1. Update in Vercel Settings
2. Go to Deployments
3. Click **...** on latest → **Redeploy**
4. Wait for build to complete

### Issue: Can't see environment variables in code

**Cause:** Not prefixed with `NEXT_PUBLIC_`

**Fix:**
- All frontend-accessible variables MUST start with `NEXT_PUBLIC_`
- Backend-only variables should NOT have this prefix
- Only variables with `NEXT_PUBLIC_` are available to browser code

---

## Deployment Order

### First Time Setup Order:

1. **Deploy Backend to Railway first**
   - Set up database
   - Set up environment variables
   - Get backend URL ✓

2. **Deploy Frontend to Vercel**
   - Use `http://localhost:4000` initially
   - Get frontend URL ✓

3. **Update Backend's FRONTEND_ORIGIN**
   - Railway backend variables
   - Set `FRONTEND_ORIGIN=https://your-vercel-url.vercel.app`
   - Auto-redeploys ✓

4. **Update Frontend's NEXT_PUBLIC_API_URL**  
   - Vercel environment variables
   - Set `NEXT_PUBLIC_API_URL=https://your-railway-url`
   - Redeploy frontend ✓

5. **Test Connection**
   - Visit frontend
   - Try login
   - Check DevTools → Network for API calls ✓

---

## Best Practices

✅ **DO:**
- Prefix frontend variables with `NEXT_PUBLIC_`
- Use HTTPS URLs in production
- No trailing slashes in URLs
- Generate new secrets for production
- Store sensitive data in backend only
- Use Railway's `.env` for backend secrets
- Use Vercel's UI for frontend env vars

❌ **DON'T:**
- Commit .env files to git
- Hardcode URLs in code
- Put secrets in frontend code
- Use localhost in production URLs
- Add `NEXT_PUBLIC_` to backend-only vars
- Reuse local JWT_SECRET in production

---

## What Gets Exposed

### Available to Browser (PUBLIC):
```
✅ NEXT_PUBLIC_API_URL
✅ NEXT_PUBLIC_APP_ENV
✅ NEXT_PUBLIC_LOG_LEVEL
```

### NOT Available to Browser (SECURE):
```
❌ JWT_SECRET
❌ DATABASE_URL  
❌ REDIS_URL
❌ API_KEYS
```

These stay in Railway backend only.

---

## Need Help?

- [Complete Deployment Guide](./COMPLETE_DEPLOYMENT_GUIDE.md)
- [Vercel Deployment Checklist](./VERCEL_DEPLOYMENT_CHECKLIST.md)
- [Vercel Docs: Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js Docs: Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
