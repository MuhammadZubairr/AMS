# Super Admin System - Developer Quick Start

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL=postgresql://user:password@localhost:5432/devflx

# Run migrations
npm run migrate up
```

### 3. Start Server
```bash
npm run dev
```

You should see:
```
[Seeder] Starting super admin seeding...
[Seeder] ✓ Super admin created: saqib.mustafa@gmail.com
[Seeder] ✓ Super admin created: ghualam.abbas@gmail.com
[Seeder] Super admin seeding completed
✓ Backend running on 4000
```

### 4. Test Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"saqib.mustafa@gmail.com","password":"Saqib@123"}' \
  -c cookies.txt
```

Get a token that looks like:
```json
{
  "ok": true,
  "data": {
    "token": "eyJ...",
    "user": {"id": 1, "email": "...", "role": "superadmin"}
  }
}
```

### 5. Access Dashboard
```bash
curl http://localhost:4000/api/superadmin/dashboard -b cookies.txt
```

You're done! ✅

---

## 📍 File Locations Quick Reference

```
/backend/src/
├── middleware/roleMiddleware.js          ← Role checking
├── controllers/superadminController.js   ← Business logic
├── routes/superadminRoutes.js            ← API endpoints
├── models/userModel.js                   ← Database queries
├── services/authService.js               ← Auth logic
├── seeds/superadminSeeder.js             ← Create accounts
└── utils/passwordValidator.js            ← Password rules

📚 Documentation:
├── SUPERADMIN_SYSTEM.md                  ← Full guide (read first)
├── SUPERADMIN_API_REFERENCE.md           ← Quick reference
├── SUPERADMIN_TESTING_GUIDE.md           ← Test scenarios
└── IMPLEMENTATION_SUMMARY.md             ← What was built
```

---

## 🎯 Common Tasks

### Add Role Check to Route
```javascript
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/admin-only', requireRole('superadmin'), controller.func);
router.get('/multi-role', requireRole('superadmin', 'manager'), controller.func);
```

### Use Password Validator
```javascript
const { validatePassword } = require('../utils/passwordValidator');

const result = validatePassword('TestPass@123');
console.log(result.isValid);    // true
console.log(result.errors);     // []
```

### Create New User
```javascript
const authService = require('../services/authService');

const user = await authService.createUserByAdmin(
  {
    email: 'new@company.com',
    password: 'NewPass@123',
    name: 'John New',
    role: 'manager'
  },
  req.user.id  // creator ID
);
```

### Query Database
```javascript
const userModel = require('../models/userModel');

const user = await userModel.findById(1);
const users = await userModel.getAllUsers({ role: 'manager', limit: 10 });
const count = await userModel.countByRole('employee');
```

---

## 🔑 Key Concepts

### JWT Token Flow
```
1. User logs in with email/password
2. Password verified against bcrypt hash
3. JWT token created with user.id, email, role
4. Token stored in httpOnly cookie
5. Token sent on each request in Authorization header
6. Middleware verifies and extracts user data
```

### Role-Based Access
```
1. Middleware checks req.user.role
2. If role not in allowedRoles → 403 Forbidden
3. If role matches → allow access
4. Otherwise → reject
```

### Super Admin Accounts
```
Created automatically on server startup:
- saqib.mustafa@gmail.com (Password: Saqib@123)
- ghualam.abbas@gmail.com (Password: Ghulam@123)

Only if they don't already exist in database.
Passwords are hashed with bcrypt before saving.
```

---

## 🐛 Common Issues & Solutions

### ❌ "Cannot find module 'superadminRoutes'"
**Fix:** Ensure route is mounted in `app.js`:
```javascript
const superadminRoutes = require('./routes/superadminRoutes');
app.use('/api/superadmin', superadminRoutes);
```

### ❌ "Forbidden: You do not have permission"
**Fix:** User role must be 'superadmin'. Login with correct account.
```bash
# Correct
curl ... -H "Authorization: Bearer <token_from_superadmin_login>"

# Wrong
curl ... -H "Authorization: Bearer <token_from_employee_login>"
```

### ❌ "Password must contain..."
**Fix:** Passwords need all 5 requirements:
- 8+ characters
- Uppercase (A-Z)
- Lowercase (a-z)
- Number (0-9)
- Special char (!@#$%^&* etc)

**Valid example:** `SecurePass@123`  
**Invalid:** `password`, `12345678`, `Password1`

### ❌ "Email already registered"
**Fix:** Email already exists. Use unique email or check database:
```sql
SELECT * FROM users WHERE email = 'your@email.com';
```

### ❌ "[Seeder] Error: connect ECONNREFUSED"
**Fix:** PostgreSQL not running. Start database:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Docker
docker-compose up -d postgres
```

### ❌ "Unauthorized" or "Invalid token"
**Fix:** Token missing or expired. Login again:
```bash
curl -X POST http://localhost:4000/api/auth/login ...
```

### ❌ "JWT_SECRET is required"
**Fix:** Set JWT_SECRET in `.env`:
```
JWT_SECRET=mysecretkeyhere_atleast32characters
```

---

## 🧪 Quick Test Commands

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"saqib.mustafa@gmail.com","password":"Saqib@123"}' \
  | jq -r '.data.token')

# Use token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/superadmin/dashboard

# Or use cookies (easier)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"saqib.mustafa@gmail.com","password":"Saqib@123"}' \
  -c cookies.txt

curl http://localhost:4000/api/superadmin/dashboard -b cookies.txt
```

---

## 📖 Documentation Map

**Start Here:**
1. This file (Quick Start) ← You are here
2. [SUPERADMIN_SYSTEM.md](./SUPERADMIN_SYSTEM.md) - Full documentation
3. [SUPERADMIN_TESTING_GUIDE.md](./SUPERADMIN_TESTING_GUIDE.md) - Test everything

**Reference:**
- [SUPERADMIN_API_REFERENCE.md](./SUPERADMIN_API_REFERENCE.md) - API endpoints cheat sheet
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What was built

---

## 🔐 Security Reminders

- ✅ Never commit `.env` files
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Set COOKIE_SECURE=true in production
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ All database queries parameterized
- ✅ CORS restricted to frontend origin

---

## 🎓 Code Examples

### Example 1: Protected Super Admin Route
```javascript
// superadminRoutes.js
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Only superadmin can access
router.get(
  '/dashboard',
  requireAuth,           // Must be logged in
  requireRole('superadmin'),  // Must be superadmin
  superadminController.getDashboard
);

module.exports = router;
```

### Example 2: Create User with Validation
```javascript
// superadminController.js
async function createManager(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      const error = new Error('Missing required fields');
      error.status = 400;
      throw error;
    }

    // Create user (validates password inside)
    const user = await authService.createUserByAdmin(
      { email, password, name, role: 'manager' },
      req.user.id
    );

    res.status(201).json({
      ok: true,
      message: 'Manager created successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
```

### Example 3: Query Users by Role
```javascript
// superadminController.js
async function getUsers(req, res, next) {
  const { role, limit = 10, offset = 0 } = req.query;

  const users = await userModel.getAllUsers({
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    role: role || null,  // Filter by role if provided
  });

  res.json({
    ok: true,
    data: { users, count: users.length },
  });
}

// Usage:
// GET /api/superadmin/users → all users
// GET /api/superadmin/users?role=manager → managers only
// GET /api/superadmin/users?limit=5&offset=0 → paginated
```

---

## 🚀 Deployment Checklist

Before deploying to Railway:

- [ ] All tests passing locally
- [ ] npm run migrate up completes
- [ ] Super admin accounts created
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] DATABASE_URL points to Railway PostgreSQL
- [ ] FRONTEND_ORIGIN set to Vercel URL
- [ ] NODE_ENV=production
- [ ] COOKIE_SECURE=true
- [ ] No .env file committed

---

## 📞 Need Help?

1. **Check:** [SUPERADMIN_TESTING_GUIDE.md](./SUPERADMIN_TESTING_GUIDE.md) - Comprehensive tests
2. **Debug:** Run test commands above to isolate issue
3. **Review:** [SUPERADMIN_SYSTEM.md](./SUPERADMIN_SYSTEM.md) - Full documentation
4. **Database:** Check `SELECT * FROM users;` directly

---

## 📚 Related Files

- API Routes: `src/routes/superadminRoutes.js`
- Controllers: `src/controllers/superadminController.js`
- Models: `src/models/userModel.js`
- Middleware: `src/middleware/roleMiddleware.js`
- Validators: `src/utils/passwordValidator.js`
- Seeders: `src/seeds/superadminSeeder.js`

---

**Version:** 1.0.0  
**Last Updated:** April 30, 2026  
**Status:** Production Ready ✅
