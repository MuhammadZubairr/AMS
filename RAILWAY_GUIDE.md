# Railway Deployment Quick Reference

Quick reference for deploying the DevFlx backend to Railway.

## Prerequisites
- Railway account created at [railway.app](https://railway.app)
- GitHub repository with this project
- PostgreSQL database (will be created on Railway)

---

## Step-by-Step Deployment

### 1. Create PostgreSQL Database
```
Dashboard → + New Project → Database → PostgreSQL
```
- Wait for it to finish provisioning
- Copy the `DATABASE_URL` value

### 2. Create Backend Service
```
Same Project → + New → GitHub Repo
```
- Select your repository
- Configure:
  - **Root Directory:** `backend/`
  - **Build Command:** `npm install` (auto-detected)
  - **Start Command:** Ensure `npm start` is set

### 3. Link Database
- In PostgreSQL plugin → Variables
- Copy `DATABASE_URL`

### 4. Set Environment Variables
Go to Backend Service → Variables → Add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Paste from PostgreSQL |
| `PORT` | `4000` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Generate from `scripts/generate-secrets.sh` |
| `JWT_EXPIRES_IN` | `7d` |
| `SALT_ROUNDS` | `10` |
| `COOKIE_SECURE` | `true` |
| `COOKIE_SAME_SITE` | `strict` |
| `FRONTEND_ORIGIN` | `https://your-frontend.vercel.app` |

### 5. Deploy
- Railway will auto-build and deploy
- Monitor progress in the Deployment tab
- Copy the service URL (e.g., `https://backend-xyz.railway.app`)

### 6. Verify
```bash
curl https://backend-xyz.railway.app/health
# Should return: {"ok":true}
```

---

## Environment Variables Detail

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random string (32+ chars)
- `NODE_ENV` - Set to `production`

### Recommended
- `FRONTEND_ORIGIN` - Your Vercel frontend URL (enables CORS)
- `COOKIE_SECURE` - `true` for production
- `COOKIE_SAME_SITE` - `strict` or `lax`

### Optional
- `PORT` - Defaults to 4000 (Railway assigns container port)
- `SALT_ROUNDS` - Defaults to 10 (bcrypt)
- `JWT_EXPIRES_IN` - Defaults to 7d

---

## Railway CLI (Alternative)

If you prefer command line:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Init project (from backend directory)
cd backend
railway init

# Link database
railway link

# Deploy
railway up

# View logs
railway logs
```

---

## Troubleshooting

### Build Fails
- Check `npm install` completes
- Verify `package.json` has correct dependencies
- Check for syntax errors in code

### Runtime Error: Port Already in Use
- Railway assigns ports automatically; PORT env var is just a fallback
- Ensure `server.js` respects `process.env.PORT`

### Database Connection Failed
- Verify `DATABASE_URL` is set
- Check PostgreSQL is running in Railway
- Use Railway dashboard to test connection

### Frontend Can't Reach Backend
- Add frontend URL to `FRONTEND_ORIGIN`
- Verify backend service is running
- Check CORS headers in `app.js`

### 502 Bad Gateway
- Check application logs in Railway dashboard
- Verify health endpoint: `https://your-backend.railway.app/health`
- Check for environment variable issues

---

## Monitoring

In Railway Dashboard:
- **Logs** - Real-time application logs
- **Metrics** - CPU, Memory, Network usage
- **Deployments** - History and status
- **Settings** - Environment variables, scaling

---

## Scaling (if needed)

Railway automatically scales based on:
- CPU usage
- Memory usage
- Request load

To adjust:
- Go to service settings
- Increase memory allocation
- Set min/max instances

---

## Redeploy

To redeploy your backend:

```
GitHub → Push changes
Railway → Auto redeploys if auto-deploy enabled
```

Or manually:
```
Railway Dashboard → Service → Deployments → Redeploy
```

---

## Database Management

### Access Database
Option 1: Railway proxy
```bash
railway connect postgresql
```

Option 2: External tools
- DBeaver, pgAdmin, etc.
- Use connection string from Railway

### Migrations
From Railway shell:
```bash
npm run migrate -- up
```

---

## Reference

- [Railway Docs](https://docs.railway.app/)
- [Railway CLI Guide](https://docs.railway.app/develop/cli)
- [Express Guide](https://docs.railway.app/guides/express)
- [PostgreSQL Guide](https://docs.railway.app/guides/databases)

---

For full deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)
