# DevFlx Employee Management System

A two-part employee attendance and management workspace with an Express backend and a Next.js frontend.

## Project Structure

- `backend/` - Express API, PostgreSQL access, JWT auth, and migrations
- `frontend/` - Next.js 14 app router UI with protected pages and auth forms

## What It Does

- User signup, login, logout, and current-user lookup
- JWT auth stored in an httpOnly cookie
- PostgreSQL database health check
- Dashboard UI for employees, attendance, and reports

## What Is Implemented

- Backend authentication endpoints
- Protected `/api/auth/me` endpoint
- PostgreSQL `users` table migration
- Login and signup pages
- Protected dashboard layout
- Database status check on the dashboard

## What Is Still Scaffolded

- Attendance actions are currently local UI state only
- Employee table uses mock data
- Reports page is a placeholder
- No attendance table or attendance API yet

## Requirements

- Node.js and npm
- PostgreSQL

## Environment Variables

### Backend

- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_ORIGIN`
- `PORT`
- `COOKIE_SECURE`
- `SALT_ROUNDS`
- `JWT_EXPIRES_IN`

### Frontend

- `NEXT_PUBLIC_API_URL`

## Run the Backend

```bash
cd backend
npm install
npm run migrate up
npm run dev
```

The backend runs on port `4000` by default.

## Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on port `3000` by default.

## Main API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /health/db`

## Notes

- The backend and frontend each have their own README files as well.
- The frontend uses `NEXT_PUBLIC_API_URL` for API requests, with a localhost fallback.
- The backend expects PostgreSQL to be available through `DATABASE_URL`.
