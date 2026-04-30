# Super Admin API Quick Reference

## Quick Setup

1. **Server starts** → Super admin accounts created automatically
2. **Login** with one of the hardcoded super admin emails
3. **Access** super admin dashboard and manage users

---

## Hardcoded Accounts

```
Email: saqib.mustafa@gmail.com | Password: Saqib@123
Email: ghualam.abbas@gmail.com | Password: Ghulam@123
```

---

## Required Headers

All requests (except login/signup) need:

```http
Authorization: Bearer <JWT_TOKEN>
```

Or use cookies (will be set automatically in browser):

```http
Cookie: token=<JWT_TOKEN>
```

---

## API Routes

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/login` | ❌ | Login (get token) |
| POST | `/api/auth/signup` | ❌ | Public signup |
| GET | `/api/superadmin/dashboard` | ✅ | Dashboard stats |
| GET | `/api/superadmin/users` | ✅ | List all users |
| GET | `/api/superadmin/users/:id` | ✅ | Get user details |
| POST | `/api/superadmin/create-manager` | ✅ | Create manager |
| POST | `/api/superadmin/create-hr` | ✅ | Create HR user |
| POST | `/api/superadmin/verify-password` | ✅ | Verify password |

---

## Request/Response Examples

### Login
```json
POST /api/auth/login

{
  "email": "saqib.mustafa@gmail.com",
  "password": "Saqib@123"
}

Response:
{
  "ok": true,
  "data": {
    "token": "eyJ...",
    "user": {
      "id": 1,
      "email": "saqib.mustafa@gmail.com",
      "role": "superadmin"
    }
  }
}
```

### Dashboard
```json
GET /api/superadmin/dashboard
Authorization: Bearer <token>

Response:
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

### Create Manager
```json
POST /api/superadmin/create-manager
Authorization: Bearer <token>

{
  "name": "John Manager",
  "email": "john@company.com",
  "password": "Secure@Pass123"
}

Response:
{
  "ok": true,
  "message": "Manager created successfully",
  "data": {
    "id": 3,
    "email": "john@company.com",
    "name": "John Manager",
    "role": "manager",
    "createdBy": 1,
    "createdAt": "2026-04-30T10:30:00Z"
  }
}
```

### Create HR User
```json
POST /api/superadmin/create-hr
Authorization: Bearer <token>

{
  "name": "Jane HR",
  "email": "jane@company.com",
  "password": "HrPass@456"
}

Response: (similar to Create Manager with role: "hr")
```

### Verify Password
```json
POST /api/superadmin/verify-password
Authorization: Bearer <token>

{
  "password": "MyPass@123"
}

Response (Valid):
{
  "ok": true,
  "isValid": true,
  "errors": []
}

Response (Invalid):
{
  "ok": true,
  "isValid": false,
  "errors": [
    "Password must contain at least one special character..."
  ]
}
```

---

## Password Requirements

✅ Minimum 8 characters
✅ At least one UPPERCASE letter (A-Z)
✅ At least one lowercase letter (a-z)
✅ At least one number (0-9)
✅ At least one special character (!@#$%^&*()_+-=[]{};':"\\|,.<>/?

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (not superadmin) |
| 404 | Not found |
| 409 | Email already exists |
| 500 | Server error |

---

## Testing Commands

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"saqib.mustafa@gmail.com","password":"Saqib@123"}' \
  -c cookies.txt

# Get Dashboard
curl http://localhost:4000/api/superadmin/dashboard -b cookies.txt

# Create Manager
curl -X POST http://localhost:4000/api/superadmin/create-manager \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"John","email":"john@company.com","password":"Test@123"}'

# Get Users
curl "http://localhost:4000/api/superadmin/users?role=manager" -b cookies.txt

# Verify Password
curl -X POST http://localhost:4000/api/superadmin/verify-password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"password":"Test@123"}'
```

---

## Roles

- `superadmin` - Full system access
- `manager` - View employees, generate reports
- `hr` - Create employees, manage HR
- `employee` - Mark attendance, view dashboard

---

## Files Modified/Created

**Core Files (edit to extend):**
- `src/controllers/superadminController.js` - Dashboard logic
- `src/routes/superadminRoutes.js` - All super admin endpoints
- `src/services/authService.js` - User creation & validation
- `src/middleware/roleMiddleware.js` - Role checks

**Utilities:**
- `src/utils/passwordValidator.js` - Password strength check
- `src/seeds/superadminSeeder.js` - Initialize accounts

**Models & Config:**
- `src/models/userModel.js` - Database queries
- `src/app.js` - Register routes
- `src/server.js` - Run seeders on startup

**Database:**
- `migrations/sqls/20260429000000-create-users-up.sql` - Users table

---

For detailed documentation, see [SUPERADMIN_SYSTEM.md](./SUPERADMIN_SYSTEM.md)
