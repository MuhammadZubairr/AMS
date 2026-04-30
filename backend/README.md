# DevFlx Attendance Backend

This folder contains the Express backend for DevFlx Attendance with authentication and super admin system. Follow `.env.example` and install dependencies.

## Quick Start

```bash
cd backend
npm install
cp .env.example .env
# edit .env to set DATABASE_URL and JWT_SECRET
npm run migrate up
npm run dev
```

## Hardcoded Super Admin Accounts

Two super admin accounts are created automatically on server start:

| Email | Password |
|-------|----------|
| `saqib.mustafa@gmail.com` | `Saqib@123` |
| `ghualam.abbas@gmail.com` | `Ghulam@123` |

Use these to login and manage the system.

## Core Endpoints

### Authentication (Public)
- `POST /api/auth/signup` - Register new employee
- `POST /api/auth/login` - Login (sets httpOnly cookie `token`)

### Health Check
- `GET /health/db` - Verify PostgreSQL connection

### Super Admin Dashboard (Requires superadmin role)
- `GET /api/superadmin/dashboard` - Get system statistics
- `GET /api/superadmin/users` - List all users
- `GET /api/superadmin/users/:id` - Get user details
- `POST /api/superadmin/create-manager` - Create manager account
- `POST /api/superadmin/create-hr` - Create HR account
- `POST /api/superadmin/verify-password` - Validate password strength

## Project Structure

```
src/
├── app.js                          # Express app setup
├── server.js                       # Server startup with seeding
├── config/
│   └── database.js                # PostgreSQL connection
├── middleware/
│   ├── authMiddleware.js          # JWT authentication
│   └── roleMiddleware.js          # Role-based access control
├── controllers/
│   ├── authController.js          # Auth logic
│   ├── healthController.js        # Health checks
│   ├── meController.js            # User profile
│   └── superadminController.js    # Super admin operations
├── routes/
│   ├── authRoutes.js              # Auth endpoints
│   ├── healthRoutes.js            # Health endpoints
│   ├── meRoutes.js                # User endpoints
│   └── superadminRoutes.js        # Super admin endpoints
├── models/
│   └── userModel.js               # User database queries
├── services/
│   └── authService.js             # Auth business logic
├── seeds/
│   └── superadminSeeder.js        # Create hardcoded accounts
├── utils/
│   └── passwordValidator.js       # Password strength validation
└── migrations/
    └── sqls/
        ├── 20260429000000-create-users-up.sql
        └── 20260429000000-create-users-down.sql
```

## User Roles

- **superadmin** - Full system access, manage all users
- **manager** - Manage assigned employees and teams
- **hr** - Create and manage employees
- **employee** - View own attendance and profile

## Authentication Flow

1. User signs up or logs in
2. JWT token issued and stored in httpOnly cookie
3. Token verified on protected routes via middleware
4. Role checked for role-based endpoints

## Password Requirements

All passwords must have:
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&*...)

## Environment Variables

See `.env.example` for all available settings:

```
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_secret_key_here
PORT=4000
NODE_ENV=production
FRONTEND_ORIGIN=https://yourfrontend.com
```

## Database

PostgreSQL with structure:

```sql
-- Users table with role-based access
users (
  id, email (unique), password_hash, name,
  role (superadmin|manager|hr|employee),
  created_by (user who created this account),
  created_at
)
```

## Documentation

- [Super Admin System Guide](./SUPERADMIN_SYSTEM.md) - Comprehensive documentation
- [API Reference](./SUPERADMIN_API_REFERENCE.md) - Quick API reference
- [Testing Guide](./SUPERADMIN_TESTING_GUIDE.md) - How to test the system

## Development

```bash
# Install dependencies
npm install

# Run migrations
npm run migrate up

# Start dev server with auto-reload
npm run dev

# Start production server
npm start
```

## Testing

See [SUPERADMIN_TESTING_GUIDE.md](./SUPERADMIN_TESTING_GUIDE.md) for comprehensive testing scenarios using cURL.

Quick test:
```bash
# Login as super admin
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"saqib.mustafa@gmail.com","password":"Saqib@123"}' \
  -c cookies.txt

# Get dashboard stats
curl http://localhost:4000/api/superadmin/dashboard -b cookies.txt
```

## Security Features

- ✅ Passwords hashed with bcrypt (12 salt rounds)
- ✅ JWT tokens with expiration
- ✅ httpOnly cookies prevent XSS
- ✅ Role-based access control
- ✅ SQL injection prevention via parameterized queries
- ✅ CORS configured to frontend origin only

## Key Features

- ✅ User authentication with JWT
- ✅ Role-based access control
- ✅ Super admin system for user management
- ✅ Password strength validation
- ✅ Hardcoded super admin accounts
- ✅ Database migrations system
- ✅ Health check endpoints
- ✅ Production-ready error handling

## Deployment

See root [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions to Railway.

Key steps:
1. Set all environment variables on Railway
2. Run migrations: `railway run npm run migrate up`
3. Server will seed super admins on startup

## Troubleshooting

**Super admins not created?**
- Check PostgreSQL is running
- Verify migrations were applied: `npm run migrate up`
- Check server logs for seeding errors

**JWT Token invalid?**
- Verify JWT_SECRET is set and consistent
- Check token hasn't expired
- Ensure token is in correct format (Bearer prefix in headers)

**Password validation failing?**
- Use `/api/superadmin/verify-password` to test
- Ensure all requirements are met

## Contributing

Follow the existing code structure and patterns. Add new features in appropriate folders and create corresponding tests.

## Notes

- Passwords are hashed with bcrypt before storage
- Tokens expire after duration in JWT_EXPIRES_IN
- All timestamps are in UTC
- Database migrations run before server starts
