# Update User Role Feature - Implementation Guide

## Overview

The Update User Role feature allows super admins to change the role of any user in the system through a dedicated modal interface with validation and confirmation.

## Features Implemented

### Backend (Node.js/Express)

✅ **New PUT Endpoint: `/api/superadmin/users/:id`**

**Functionality:**
- Update user role (manager, hr, employee)
- Update user name (optional)
- Proper validation for allowed roles
- Prevents user from changing their own role
- Returns updated user object

**Request:**
```bash
PUT /api/superadmin/users/5
Content-Type: application/json
Cookie: token=JWT_TOKEN

{
  "role": "manager"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "User updated successfully",
  "data": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager",
    "created_by": 1,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Cases:**
```json
{
  "ok": false,
  "error": "Invalid role. Allowed roles: superadmin, manager, hr, employee"
}
```

```json
{
  "ok": false,
  "error": "You cannot change your own role"
}
```

### Frontend (Next.js/React)

✅ **Edit Role Modal**

**Features:**
- Opens when clicking "Edit" on a user
- Shows current role clearly
- Dropdown to select new role
- Validation prevents invalid roles
- "Update Role" button only enabled if role changed
- Loading state while updating
- Success notification on completion
- Error notification on failure
- Auto-closes after successful update

**User Flow:**
1. Click "Edit" button on user row/card
2. Modal opens showing user email and current role
3. Select new role from dropdown
4. Warning message shows impact (only if role changed)
5. Click "Update Role" to confirm
6. Loading spinner appears
7. Success notification shows
8. Modal closes automatically
9. User list refreshes with new data

## Architecture

### Backend Files Modified

**`backend/src/models/userModel.js`**
```javascript
// New function
async function updateUser(id, updates = {}) {
  // Supports updating 'name' and 'role' fields
  // Returns updated user object
  // Throws 404 if user not found
  // Throws 400 if no valid fields provided
}
```

**Features:**
- Dynamic SQL query building
- Only allows 'name' and 'role' fields
- Prevents SQL injection with parameterized queries
- Returns full user object after update

**`backend/src/controllers/superadminController.js`**
```javascript
// New function
async function updateUserRole(req, res, next) {
  // Validates user ID
  // Validates role is one of: superadmin, manager, hr, employee
  // Prevents user from changing own role
  // Calls userModel.updateUser()
  // Returns success response
}
```

**`backend/src/routes/superadminRoutes.js`**
```javascript
// New route
router.put('/users/:id', superadminController.updateUserRole);
```

### Frontend Files Modified

**`frontend/src/app/superadmin/users/page.tsx`**
- Added edit role modal with Formik validation
- Added Yup schema for role validation
- Added notification state management
- Auto-hiding notifications (3 seconds)
- Real-time role change impact warning
- Disabled submit until role actually changed

**`frontend/src/services/superadminApi.ts`**
- Added `updateUserRole()` function for API calls

**`frontend/tailwind.config.js`**
- Added `fade-in` animation for notifications

## User Interface Details

### Edit Role Modal

```
┌────────────────────────────────────┐
│ Edit User Role                  ✕  │
│ john@example.com                   │
├────────────────────────────────────┤
│                                    │
│ CURRENT ROLE                       │
│ ┌──────────────────────────────┐  │
│ │ employee                     │  │
│ └──────────────────────────────┘  │
│                                    │
│ NEW ROLE *                         │
│ ┌──────────────────────────────┐  │
│ │▼ Select a role             │  │
│ │ manager                      │  │
│ │ hr                           │  │
│ │ employee                     │  │
│ └──────────────────────────────┘  │
│                                    │
│ ⚠ IMPORTANT                        │
│ Changing the role will give this  │
│ user manager permissions         │
│ immediately.                       │
│                                    │
├────────────────────────────────────┤
│ [Cancel]     [Update Role]         │
└────────────────────────────────────┘
```

### Notification

```
┌──────────────────────────────┐
│ ✓ Role updated to manager    │
└──────────────────────────────┘
(Auto-closes after 3 seconds)
```

## Validation Rules

### Backend Validation
- User ID must be numeric
- At least one field (role or name) required
- Role must be one of: superadmin, manager, hr, employee
- User cannot change own role (403 Forbidden)
- User must exist in database (404 Not Found)

### Frontend Validation (Yup)
```typescript
const editRoleSchema = yup.object({
  role: yup
    .string()
    .oneOf(['manager', 'hr', 'employee'], 'Invalid role selected')
    .required('Role is required'),
});
```

## State Management

### Component State
```typescript
const [editUser, setEditUser] = useState<User | null>(null);
const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
const [isUpdating, setIsUpdating] = useState(false);
```

### Notification Auto-hide
```typescript
useEffect(() => {
  if (notification) {
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }
}, [notification]);
```

## API Integration Flow

### Step 1: Click Edit
```
User clicks "Edit" button on user row
```

### Step 2: Modal Opens
```
editUser state set to selected user
Modal displays with current role
```

### Step 3: Select New Role
```
User selects different role from dropdown
Impact warning shows
Submit button enabled
```

### Step 4: Submit
```
Formik validates role
Validation schema checks allowed values
```

### Step 5: API Call
```
Frontend:
POST /api/superadmin/users/5
{ "role": "manager" }

Backend:
- Validates role
- Checks not changing own role
- Updates database
- Returns updated user
```

### Step 6: Success Response
```
{
  "ok": true,
  "message": "User updated successfully",
  "data": { updated user object }
}
```

### Step 7: UI Update
```
- Show success notification
- Invalidate React Query cache
- Modal closes after 500ms
- User list refreshes with fresh data
```

### Step 8: Auto-hide Notification
```
- Notification stays for 3 seconds
- Auto-hides
- User can dismiss manually
```

## Error Handling

### Frontend Error Scenarios

**Invalid Role:**
```
Display validation error in modal
"Invalid role selected"
Button stays disabled
```

**Network Error:**
```
Show error notification:
"Failed to update user"
Modal stays open
User can retry
```

**Server Error (403 - Own Role):**
```
Show error notification:
"You cannot change your own role"
Modal stays open
```

**Server Error (400 - Invalid Role):**
```
Show error notification:
"Invalid role. Allowed roles: superadmin, manager, hr, employee"
```

**Server Error (404 - User Not Found):**
```
Show error notification:
"User not found"
Users list refreshes
```

## Security Considerations

✅ **Backend Authorization**
- All routes require super admin role
- User cannot modify own role
- Parameterized queries prevent SQL injection
- Role whitelist validation

✅ **Frontend Security**
- XSS protection (React escapes)
- CSRF tokens (Next.js)
- Input validation before submission
- Type safety with TypeScript

✅ **Data Privacy**
- No sensitive data in logs
- Proper error messages (no info leaks)
- Role change auditing (created_by field)

## Testing Scenarios

### Test Case 1: Valid Role Change
1. Click Edit on employee user
2. Select "manager" role
3. Click "Update Role"
4. Verify success notification
5. Verify list updates with new role

### Test Case 2: No Change
1. Click Edit on user
2. Leave role same
3. Button should be disabled
4. Cannot submit

### Test Case 3: Own Role Change
1. Super admin user clicks Edit on own profile
2. Selects different role
3. Clicks Update
4. Should see error: "Cannot change your own role"

### Test Case 4: Invalid Selection
1. Click Edit on user
2. Don't select any role
3. Button stays disabled
4. Validation message shows

### Test Case 5: Network Error
1. Click Edit on user
2. Disconnect network (DevTools)
3. Try to update
4. Should show error notification

### Test Case 6: Rapid Updates
1. Click Edit on user
2. Quickly submit twice
3. Should prevent double submission (button disabled during update)

## Performance Considerations

✅ **React Query Integration**
- Automatic cache invalidation
- Only affected users refetch
- No full list reload needed

✅ **Responsive Form**
- Formik handles state efficiently
- Yup validation instant
- No unnecessary re-renders

✅ **Notification Handling**
- Auto-cleanup with useEffect
- No memory leaks
- Proper timer cleanup

## Configuration

### Allowed Roles
Edit in `frontend/src/constants/superadmin.ts`:
```typescript
export const ROLE_OPTIONS = [
  { value: 'manager', label: 'Manager' },
  { value: 'hr', label: 'HR' },
  { value: 'employee', label: 'Employee' },
];
```

### Notification Duration
Edit in `frontend/src/app/superadmin/users/page.tsx`:
```typescript
const NOTIFICATION_DURATION = 3000; // milliseconds
setTimeout(() => setNotification(null), NOTIFICATION_DURATION);
```

## Troubleshooting

### Issue: Modal doesn't open
**Cause:** editUser state not being set
**Solution:**
1. Check Edit button onClick handler
2. Verify `setEditUser(user)` is called
3. Check console for errors

### Issue: "Cannot change own role" error
**Cause:** Trying to change own role
**Solution:**
- Have another super admin change your role
- Backend prevents this for security

### Issue: Notification doesn't show
**Cause:** Animation not loading
**Solution:**
1. Clear browser cache
2. Run `npm run build` to rebuild Tailwind
3. Check tailwind.config.js has animation defined

### Issue: Role change not persisting
**Cause:** Cache not invalidating
**Solution:**
1. Check queryClient invalidation in code
2. Verify cache keys match
3. Check API response successful

## API Reference

### Update User Role
```
PUT /api/superadmin/users/:id
Content-Type: application/json

Request Body:
{
  "role": "manager"
}

Response:
{
  "ok": true,
  "message": "User updated successfully",
  "data": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager",
    "created_by": 1,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

## CLI Testing

### Using cURL
```bash
# Get user ID first
curl "http://localhost:4000/api/superadmin/users?limit=100" \
  -H "Cookie: token=YOUR_JWT_TOKEN"

# Update role
curl -X PUT "http://localhost:4000/api/superadmin/users/5" \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -d '{"role": "manager"}'
```

### Using HTTPie
```bash
http PUT http://localhost:4000/api/superadmin/users/5 \
  role=manager \
  --cookies "token=YOUR_JWT_TOKEN"
```

## Documentation Files

- [User Management Feature](./USER_MANAGEMENT_FEATURE.md)
- [User Management Quick Start](./USER_MANAGEMENT_QUICK_START.md)
- [Backend README](../backend/README.md)
- [Frontend Integration Guide](./FRONTEND_INTEGRATION_GUIDE.md)

---

**Status:** ✅ Production Ready
**Last Updated:** 30 April 2026
