# Super Admin System Documentation

## Overview

The Super Admin System provides role-based access control for the Employee Attendance Management System. It includes hardcoded super admin accounts, role-based access middleware, and APIs for managing users by role.

---

## Features

### 1. **Hardcoded Super Admin Accounts**

Two super admin accounts are automatically created when the server starts:

| Email | Password |
|-------|----------|
| `saqib.mustafa@gmail.com` | `Saqib@123` |
| `ghualam.abbas@gmail.com` | `Ghulam@123` |

**Note:** If these accounts already exist, they are not recreated.

### 2. **User Roles**

The system supports 4 roles:
- **superadmin** - Full system access
- **manager** - Can manage employees and view reports
- **hr** - Can create employees and manage HR functions
- **employee** - Standard employee access

### 3. **Password Validation**

Passwords must meet these requirements:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*...)

### 4. **Role-Based Access Control**

Middleware restricts API access based on user role. Only super admins can access super admin endpoints.

---

## Project Structure

```
backend/src/
├── middleware/
│   ├── authMiddleware.js        # JWT authentication
│   └── roleMiddleware.js        # Role-based access control
├── controllers/
│   └── superadminController.js  # Super admin logic
├── routes/
│   └── superadminRoutes.js      # Super admin endpoints
├── models/
│   └── userModel.js             # User database queries
├── services/
│   ├── authService.js           # Auth business logic
├── seeds/
│   └── superadminSeeder.js      # Seeder for hardcoded accounts
├── utils/
│   └── passwordValidator.js     # Password strength validation
└── app.js                       # Main app configuration
```

---

## Database Schema

```sql
CREATE TABLE users (
  id bigserial PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  role varchar(50) NOT NULL DEFAULT 'employee',
  created_by bigint REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**Columns:**
- `id` - Unique user identifier
- `email` - Unique user email
- `password_hash` - Bcrypt hashed password
- `name` - User's full name
- `role` - User's role (superadmin, manager, hr, employee)
- `created_by` - ID of user who created this account (NULL for hardcoded accounts)
- `created_at` - Account creation timestamp

---

## API Endpoints

All super admin endpoints require:
1. Valid JWT token in cookies or Authorization header
2. User role must be "superadmin"

### Base URL
```
POST   /api/auth/signup          # Public signup
POST   /api/auth/login           # Public login
GET    /api/superadmin/dashboard # Super admin dashboard
GET    /api/superadmin/users     # List all users
GET    /api/superadmin/users/:userId  # Get user details
POST   /api/superadmin/create-manager # Create manager
POST   /api/superadmin/create-hr      # Create HR user
POST   /api/superadmin/verify-password# Verify password strength
```

---

## Endpoint Details

### 1. Login (Public)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "saqib.mustafa@gmail.com",
  "password": "Saqib@123"
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "saqib.mustafa@gmail.com",
      "role": "superadmin"
    }
  }
}
```

---

### 2. Super Admin Dashboard
```http
GET /api/superadmin/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "totalUsers": 15,
    "breakdown": {
      "superadmins": 2,
      "managers": 3,
      "hr": 4,
      "employees": 6
    }
  }
}
```

---

### 3. Get All Users (with filtering)
```http
GET /api/superadmin/users?role=manager&limit=10&offset=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `role` (optional) - Filter by role (manager, hr, employee, superadmin)
- `limit` (optional, default=10) - Results per page
- `offset` (optional, default=0) - Number of results to skip

**Response:**
```json
{
  "ok": true,
  "data": {
    "users": [
      {
        "id": 3,
        "email": "manager1@company.com",
        "name": "John Manager",
        "role": "manager",
        "created_by": 1,
        "created_at": "2026-04-30T10:30:00Z"
      }
    ],
    "count": 1
  }
}
```

---

### 4. Get User Details
```http
GET /api/superadmin/users/3
Authorization: Bearer <token>
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "id": 3,
    "email": "manager1@company.com",
    "name": "John Manager",
    "role": "manager",
    "created_by": 1,
    "created_at": "2026-04-30T10:30:00Z"
  }
}
```

---

### 5. Create Manager
```http
POST /api/superadmin/create-manager
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Manager",
  "email": "john.manager@company.com",
  "password": "SecurePass@123"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Manager created successfully",
  "data": {
    "id": 3,
    "email": "john.manager@company.com",
    "name": "John Manager",
    "role": "manager",
    "createdBy": 1,
    "createdAt": "2026-04-30T10:30:00Z"
  }
}
```

**Errors:**
- 400 - Missing fields or invalid password
- 409 - Email already registered
- 401 - Not authenticated
- 403 - Not a super admin

---

### 6. Create HR User
```http
POST /api/superadmin/create-hr
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane HR",
  "email": "jane.hr@company.com",
  "password": "HrPass@456"
}
```

**Response:** Same format as Create Manager (with role: "hr")

---

### 7. Verify Password Strength
```http
POST /api/superadmin/verify-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "MyPass@123"
}
```

**Response (Valid):**
```json
{
  "ok": true,
  "isValid": true,
  "errors": []
}
```

**Response (Invalid):**
```json
{
  "ok": true,
  "isValid": false,
  "errors": [
    "Password must contain at least one special character (!@#$%^&*...)"
  ]
}
```

---

## Usage Examples

### Example 1: Login as Super Admin

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "saqib.mustafa@gmail.com",
    "password": "Saqib@123"
  }' \
  -c cookies.txt
```

### Example 2: Get Dashboard Stats (with cookie)

```bash
curl -X GET http://localhost:4000/api/superadmin/dashboard \
  -b cookies.txt
```

### Example 3: Create a Manager (with Bearer token)

```bash
curl -X POST http://localhost:4000/api/superadmin/create-manager \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "John Manager",
    "email": "john@company.com",
    "password": "Secure@Pass123"
  }'
```

---

## Middleware

### Role-Based Access Middleware

Located in `src/middleware/roleMiddleware.js`

```javascript
const { requireRole } = require('./middleware/roleMiddleware');

// Restrict route to only superadmins
router.get('/dashboard', requireRole('superadmin'), controller.getDashboard);

// Allow multiple roles
router.get('/users', requireRole('superadmin', 'manager'), controller.getUsers);
```

### Authentication Middleware

Located in `src/middleware/authMiddleware.js`

```javascript
const { requireAuth } = require('./middleware/authMiddleware');

// Requires valid JWT token
router.get('/protected', requireAuth, controller.protectedRoute);
```

---

## Password Validation

Located in `src/utils/passwordValidator.js`

```javascript
const { validatePassword } = require('./utils/passwordValidator');

const result = validatePassword('MyPass@123');
// Returns: { isValid: true, errors: [] }

const result2 = validatePassword('weak');
// Returns: { 
//   isValid: false, 
//   errors: [
//     'Password must be at least 8 characters long',
//     'Password must contain at least one uppercase letter',
//     ...
//   ]
// }
```

---

## Seeding

Located in `src/seeds/superadminSeeder.js`

The seeder runs automatically when the server starts:

```javascript
// File: src/seeds/superadminSeeder.js
async function seedSuperAdmins() {
  // Creates hardcoded super admin accounts
  // Only if they don't already exist
}
```

Called from `src/server.js`:

```javascript
async function startServer() {
  await seedSuperAdmins();
  app.listen(port, () => {
    console.log(`Backend running on ${port}`);
  });
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `409` - Conflict (e.g., email already exists)
- `500` - Server error

---

## Security Considerations

1. **JWT Tokens** - Stored in httpOnly cookies for XSS protection
2. **Password Hashing** - Bcrypt with configurable salt rounds (default: 12)
3. **SQL Injection** - Prevented through parameterized queries
4. **Role Verification** - Every protected endpoint verifies the user's role
5. **CORS** - Configured to only allow requests from frontend origin

---

## Testing

### Test with cURL

```bash
# Start the server
npm run dev

# In another terminal:

# 1. Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "saqib.mustafa@gmail.com",
    "password": "Saqib@123"
  }' \
  -c cookies.txt

# 2. Get Dashboard
curl -X GET http://localhost:4000/api/superadmin/dashboard \
  -b cookies.txt

# 3. Create Manager
curl -X POST http://localhost:4000/api/superadmin/create-manager \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Test Manager",
    "email": "test.manager@company.com",
    "password": "Test@Pass123"
  }'
```

---

## Troubleshooting

### Issue: Super admin accounts not created

**Check:**
1. Database is running and migrations have been applied
2. Server logs show seeding process
3. Check database: `SELECT * FROM users WHERE role = 'superadmin';`

### Issue: 401 Unauthorized on super admin endpoints

**Check:**
1. JWT token is valid and not expired
2. Token is being sent in Authorization header or cookies
3. User role is actually "superadmin"

### Issue: 403 Forbidden on super admin endpoints

**Check:**
1. Logged-in user's role is not "superadmin"
2. User is logged in with a regular employee account

### Issue: Password validation failing

**Check:**
1. Password meets all requirements (length, uppercase, lowercase, number, special char)
2. Use `/api/superadmin/verify-password` to test password strength

---

## Next Steps

1. **HR User Creation** - HR users can create employees
2. **Manager Dashboard** - Managers can view their assigned employees
3. **Attendance Tracking** - Employees mark daily attendance
4. **Reports** - Generate attendance and performance reports

---

## References

- [bcrypt documentation](https://www.npmjs.com/package/bcrypt)
- [JWT documentation](https://jwt.io)
- [Express.js middleware guide](https://expressjs.com/en/guide/using-middleware.html)
- [PostgreSQL documentation](https://www.postgresql.org/docs/)

---

**Version:** 1.0.0  
**Last Updated:** April 30, 2026
