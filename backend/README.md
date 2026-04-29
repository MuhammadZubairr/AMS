# DevFlx Attendance Backend

This folder contains the Express backend for DevFlx Attendance (auth scaffold). Follow `.env.sample` and install dependencies.

Quick start:

```bash
cd backend
npm install
cp .env.sample .env
# edit .env to set DATABASE_URL and JWT_SECRET
npm run migrate up
npm run dev
```

Endpoints:
- `POST /api/auth/signup` { name, email, password }
- `POST /api/auth/login` { email, password } (sets httpOnly cookie `token`)
- `GET /health/db` verifies the PostgreSQL connection from the app
