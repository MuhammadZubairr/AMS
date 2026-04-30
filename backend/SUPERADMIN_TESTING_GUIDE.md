# Super Admin System - Testing Guide

This guide will help you test all the Super Admin features.

---

## Prerequisites

1. Backend running: `npm run dev` from `backend/` directory
2. Database running with migrations applied
3. cURL or Postman installed (for API testing)

---

## Test Scenario

We'll walk through:
1. Verify super admin accounts were created
2. Login with credentials
3. Access dashboard
4. Create a manager
5. Create an HR user
6. View all users
7. Test password validation

---

## Step 1: Verify Seeding

Check server output when you run `npm run dev`:

```
[Seeder] Starting super admin seeding...
[Seeder] ✓ Super admin created: saqib.mustafa@gmail.com
[Seeder] ✓ Super admin created: ghualam.abbas@gmail.com
[Seeder] Super admin seeding completed
✓ Backend running on 4000
```

---

## Step 2: Test Super Admin Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "saqib.mustafa@gmail.com",
    "password": "Saqib@123"
  }' \
  -c cookies.txt \
  -v
```

**Expected Response:**
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

**What this tests:**
- ✅ Super admin account exists
- ✅ Password hashing is correct
- ✅ JWT token generation works
- ✅ Cookies are set

Save the token in environment variable:
```bash
export TOKEN="<paste_token_here>"
```

---

## Step 3: Test Dashboard Access

```bash
curl -X GET http://localhost:4000/api/superadmin/dashboard \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -v
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "totalUsers": 2,
    "breakdown": {
      "superadmins": 2,
      "managers": 0,
      "hr": 0,
      "employees": 0
    }
  }
}
```

**What this tests:**
- ✅ Role-based access middleware works
- ✅ JWT verification works
- ✅ Database queries work
- ✅ User counts are accurate

---

## Step 4: Test Password Validation

```bash
curl -X POST http://localhost:4000/api/superadmin/verify-password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "password": "weak"
  }' \
  -v
```

**Expected Response (Invalid):**
```json
{
  "ok": true,
  "isValid": false,
  "errors": [
    "Password must be at least 8 characters long",
    "Password must contain at least one uppercase letter",
    "Password must contain at least one number",
    "Password must contain at least one special character (!@#$%^&*...)"
  ]
}
```

Now test with a valid password:

```bash
curl -X POST http://localhost:4000/api/superadmin/verify-password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "password": "ValidPass@123"
  }' \
  -v
```

**Expected Response (Valid):**
```json
{
  "ok": true,
  "isValid": true,
  "errors": []
}
```

**What this tests:**
- ✅ Password validation rules work
- ✅ Complex regex patterns work
- ✅ Error messages are clear

---

## Step 5: Create a Manager

```bash
curl -X POST http://localhost:4000/api/superadmin/create-manager \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "John Manager",
    "email": "john.manager@company.com",
    "password": "Manager@Pass123"
  }' \
  -v
```

**Expected Response:**
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

**What this tests:**
- ✅ Manager creation works
- ✅ Password hashing with bcrypt
- ✅ Role assignment
- ✅ created_by is set correctly
- ✅ Database insertion works

---

## Step 6: Test Error Cases (Manager Creation)

### Test 1: Missing Fields
```bash
curl -X POST http://localhost:4000/api/superadmin/create-manager \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "John Manager"
  }' \
  -v
```

**Expected:** 400 error - "Missing required fields"

### Test 2: Weak Password
```bash
curl -X POST http://localhost:4000/api/superadmin/create-manager \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Jane Manager",
    "email": "jane.manager@company.com",
    "password": "weak"
  }' \
  -v
```

**Expected:** 400 error - Password validation errors

### Test 3: Email Already Exists
```bash
curl -X POST http://localhost:4000/api/superadmin/create-manager \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Another John",
    "email": "john.manager@company.com",
    "password": "NewPass@123"
  }' \
  -v
```

**Expected:** 409 error - "Email already registered"

---

## Step 7: Create an HR User

```bash
curl -X POST http://localhost:4000/api/superadmin/create-hr \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Jane HR",
    "email": "jane.hr@company.com",
    "password": "HrPass@456"
  }' \
  -v
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "HR user created successfully",
  "data": {
    "id": 4,
    "email": "jane.hr@company.com",
    "name": "Jane HR",
    "role": "hr",
    "createdBy": 1,
    "createdAt": "2026-04-30T10:31:00Z"
  }
}
```

**What this tests:**
- ✅ HR creation works
- ✅ Role is set to "hr"
- ✅ Created by is tracked

---

## Step 8: Get All Users

```bash
curl -X GET http://localhost:4000/api/superadmin/users \
  -b cookies.txt \
  -v
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "users": [
      {
        "id": 4,
        "email": "jane.hr@company.com",
        "name": "Jane HR",
        "role": "hr",
        "created_by": 1,
        "created_at": "2026-04-30T10:31:00Z"
      },
      {
        "id": 3,
        "email": "john.manager@company.com",
        "name": "John Manager",
        "role": "manager",
        "created_by": 1,
        "created_at": "2026-04-30T10:30:00Z"
      },
      {
        "id": 2,
        "email": "ghualam.abbas@gmail.com",
        "name": "Ghulam Abbas",
        "role": "superadmin",
        "created_by": null,
        "created_at": "2026-04-30T09:00:00Z"
      },
      {
        "id": 1,
        "email": "saqib.mustafa@gmail.com",
        "name": "Saqib Mustafa",
        "role": "superadmin",
        "created_by": null,
        "created_at": "2026-04-30T09:00:00Z"
      }
    ],
    "count": 4
  }
}
```

---

## Step 9: Get Users by Role

```bash
curl -X GET "http://localhost:4000/api/superadmin/users?role=manager" \
  -b cookies.txt \
  -v
```

**Expected:** Only manager users returned

---

## Step 10: Get User Details

```bash
curl -X GET http://localhost:4000/api/superadmin/users/3 \
  -b cookies.txt \
  -v
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": 3,
    "email": "john.manager@company.com",
    "name": "John Manager",
    "role": "manager",
    "created_by": 1,
    "created_at": "2026-04-30T10:30:00Z"
  }
}
```

---

## Step 11: Check Dashboard Again

```bash
curl -X GET http://localhost:4000/api/superadmin/dashboard \
  -b cookies.txt \
  -v
```

**Expected Response (Updated):**
```json
{
  "ok": true,
  "data": {
    "totalUsers": 4,
    "breakdown": {
      "superadmins": 2,
      "managers": 1,
      "hr": 1,
      "employees": 0
    }
  }
}
```

---

## Step 12: Test Non-Super Admin Access

Try to access super admin endpoint with employee account:

```bash
# First, create an employee account
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestEmployee",
    "email": "test.employee@company.com",
    "password": "Employee@123"
  }' \
  -v

# Login as employee
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.employee@company.com",
    "password": "Employee@123"
  }' \
  -c employee_cookies.txt \
  -v

# Try to access super admin dashboard (should fail)
curl -X GET http://localhost:4000/api/superadmin/dashboard \
  -b employee_cookies.txt \
  -v
```

**Expected Response:** 403 Forbidden
```json
{
  "error": "Forbidden: You do not have permission to access this resource",
  "userRole": "employee",
  "requiredRoles": ["superadmin"]
}
```

**What this tests:**
- ✅ Role-based access control works
- ✅ Non-superadmins are blocked
- ✅ Error messages are informative

---

## Step 13: Test Without Authentication

```bash
curl -X GET http://localhost:4000/api/superadmin/dashboard \
  -v
```

**Expected Response:** 401 Unauthorized
```json
{
  "error": "Unauthorized: Please login first"
}
```

---

## Test Summary Checklist

- [ ] Super admin accounts created on startup
- [ ] Super admin can login
- [ ] Super admin can access dashboard
- [ ] Dashboard shows correct user counts
- [ ] Password validation works
- [ ] Cannot create user with weak password
- [ ] Cannot create user with existing email
- [ ] Manager creation works
- [ ] HR user creation works
- [ ] Can list all users
- [ ] Can filter users by role
- [ ] Can get individual user details
- [ ] Non-superadmin users cannot access protected endpoints
- [ ] Unauthenticated users cannot access protected endpoints
- [ ] Role-based access control works properly

---

## Database Verification

You can also verify data directly in PostgreSQL:

```sql
-- Connect to database
psql postgresql://user:password@localhost/devflx_attendance

-- Check users
SELECT id, email, name, role, created_by, created_at FROM users;

-- Check superadmins
SELECT * FROM users WHERE role = 'superadmin';

-- Check managers
SELECT * FROM users WHERE role = 'manager';

-- Count by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;
```

---

## Performance Notes

- Dashboard query should be fast (<100ms)
- Password validation should be instant (<10ms)
- User creation includes bcrypt hashing (~100-500ms depending on SALT_ROUNDS)

---

## Troubleshooting

### Issue: `[Seeder] Error seeding super admins: connect ECONNREFUSED`
**Solution:** Make sure PostgreSQL is running. Run migrations first: `npm run migrate up`

### Issue: `401 Unauthorized` on all super admin routes
**Solution:** Make sure token is in cookie or Authorization header. Check JWT_SECRET env var.

### Issue: `403 Forbidden` on super admin routes
**Solution:** User role must be "superadmin". Check user's role in database.

### Issue: Password validation failing unexpectedly
**Solution:** Check all password requirements are met. Use `/verify-password` endpoint to test.

---

## Next: Manual Testing with Postman

1. **Import API:** Create requests for each endpoint
2. **Environment:** Set `{{base_url}}` and `{{token}}`
3. **Tests:** Add test scripts for automated validation
4. **Collection:** Save for team sharing

---

For detailed API documentation, see [SUPERADMIN_SYSTEM.md](./SUPERADMIN_SYSTEM.md)
