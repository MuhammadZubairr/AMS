# Vercel Deployment Quick Reference

Quick reference for deploying the DevFlx frontend to Vercel.

## Prerequisites
- Vercel account created at [vercel.com](https://vercel.com)
- GitHub repository with this project
- Backend URL from Railway (will set this later)

---

## Step-by-Step Deployment

### 1. Create Vercel Project
```
Dashboard → Add New → Project
```
- Select "Import Git Repository"
- Find and select your repository
- Authorize if needed

### 2. Configure Import Settings
- **Project Name:** `devflx-frontend` (or your choice)
- **Framework:** Next.js
- **Root Directory:** `frontend/`
- **Build Command:** `npm run build` (auto-detected)
- **Install Command:** `npm install` (auto-detected)
- **Output Directory:** `.next` (auto-detected)

### 3. Set Environment Variables
Before deployment, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-railway-backend.railway.app` |

*Note:* If you don't have the Railway backend URL yet, you can:
- Deploy without it and add later
- Leave default `http://localhost:4000`
- Update it once Railway backend is ready

### 4. Deploy
- Click **Deploy** button
- Vercel will build and deploy automatically
- Monitor progress in the dashboard
- Once complete, you'll get a production URL

### 5. Get Your URL
From Vercel Dashboard:
- Copy your production URL (e.g., `https://devflx.vercel.app`)
- This is what you'll set as `FRONTEND_ORIGIN` on Railway

---

## Environment Variables Detail

### Required
- `NEXT_PUBLIC_API_URL` - Your Railway backend URL

**Important:** This variable will be baked into the frontend build, so it must be set correctly before deployment.

---

## Vercel CLI (Alternative)

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# For production
vercel --prod

# View deployments
vercel list

# View logs
vercel logs [url]
```

---

## Automatic Deployments

By default, Vercel auto-deploys when:
- Changes are pushed to your main branch
- Pull requests are created (preview deployments)
- Manual redeploy via dashboard

### Disable Auto-Deploy
Settings → Git → Uncheck "Deploy on push"

---

## Preview Deployments

Vercel automatically creates preview URLs for:
- Pull requests
- Feature branches (if enabled)

Each preview gets a unique URL for testing.

---

## Connecting Your Domain

To use a custom domain:

1. Go to project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)
4. Wait for DNS propagation

---

## Redeploy

To redeploy your frontend:

### Method 1: Git Push
```bash
git push origin main
# Vercel auto-deploys
```

### Method 2: Manual Redeploy
```
Dashboard → Deployments → Click latest → Redeploy
```

### Method 3: CLI
```bash
vercel --prod
```

---

## Building Locally

To test the build before deploying:

```bash
cd frontend
npm run build
npm start
```

This simulates the production environment.

---

## Environment Variable Updates

### Update After Deployment

If you need to change `NEXT_PUBLIC_API_URL`:

1. Go to Settings → Environment Variables
2. Edit the value
3. Go to Deployments → Redeploy latest

**Important:** Environment changes require a redeploy to take effect.

---

## Analytics & Monitoring

Vercel provides:
- **Web Analytics** - Page views, Core Web Vitals
- **Build Insights** - Build duration, size analysis
- **Speed Insights** - Performance metrics
- **Error Tracking** - Exceptions and crashes

Enable in Settings → Analytics.

---

## Troubleshooting

### Build Fails
- Check build logs in Deployments tab
- Verify `npm run build` works locally
- Check for missing dependencies in `package.json`
- Ensure `next.config.js` is valid

### 404 Errors
- Ensure root directory is set to `frontend/`
- Check file paths (case-sensitive)
- Rebuild and redeploy

### API Not Connecting
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check for typos in the URL
- Ensure Railway backend is running
- Check browser console for CORS errors

### Environment Variables Not Applied
- Redeploy after changing environment variables
- Variables are baked into the build
- Preview deployments may have different variables

### Performance Issues
- Check bundle size in build logs
- Use Vercel's Speed Insights
- Enable Image Optimization in `next.config.js`

---

## Security Best Practices

### ✓ Do
- Keep secrets in environment variables
- Use `NEXT_PUBLIC_` only for public data
- Enable Vercel's Domain Security

### ✗ Don't
- Commit `.env` or `.env.local` 
- Put API keys in `NEXT_PUBLIC_` variables
- Hardcode URLs in code

---

## Reference

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## Key Takeaways

1. **Root Directory:** Must be set to `frontend/`
2. **Environment Variables:** `NEXT_PUBLIC_API_URL` needed before deploy
3. **Auto Deploy:** Enabled by default on main branch push
4. **Redeploy:** Required when environment variables change
5. **Domain:** Get URL from Vercel dashboard after deploy

---

For full deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)
