# Manager Management Module - Implementation Guide

## Overview

The Manager Management module provides a complete CRUD interface for super admins to manage all manager accounts in the system. This includes creating new managers, viewing their details, editing information, and removing managers from the system.

## Features Implemented

### Backend (Node.js/Express)

✅ **GET Endpoint: `/api/superadmin/managers`**

**Functionality:**
- Retrieve all managers with optional search and pagination
- Filter managers by name or email
- Return paginated results with total count
- Supports pagination parameters

**Request:**
```bash
GET /api/superadmin/managers?search=john&limit=10&offset=0
Cookie: token=JWT_TOKEN
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "users": [
      {
        "id": 2,
        "name": "John Manager",
        "email": "john@example.com",
        "role": "manager",
        "created_by": 1,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 1,
    "count": 1,
    "limit": 10,
    "offset": 0
  }
}
```

✅ **POST Endpoint: `/api/superadmin/create-manager`** (Already existed, uses same password validation)

**Functionality:**
- Create new manager accounts
- Validate password strength requirements
- Return newly created manager object

**Request:**
```bash
POST /api/superadmin/create-manager
Content-Type: application/json
Cookie: token=JWT_TOKEN

{
  "name": "John Manager",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

✅ **PUT Endpoint: `/api/superadmin/managers/:id`**

**Functionality:**
- Update manager name and/or email
- Validate email uniqueness
- Verify manager role before updating
- Return updated manager object

**Request:**
```bash
PUT /api/superadmin/managers/2
Content-Type: application/json
Cookie: token=JWT_TOKEN

{
  "name": "John Smith",
  "email": "jonsmith@example.com"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Manager updated successfully",
  "data": {
    "id": 2,
    "name": "John Smith",
    "email": "jonsmith@example.com",
    "role": "manager",
    "created_by": 1,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

✅ **DELETE Endpoint: `/api/superadmin/users/:id`** (Shared with users)

**Functionality:**
- Delete manager account permanently
- Validates manager exists
- Prevents self-deletion
- Prevents deleting superadmins

### Frontend (Next.js/React)

✅ **Managers Management Page** - Complete CRUD Interface

**Features:**
- **List Managers**: Display all managers in paginated table (desktop) or cards (mobile)
- **Search**: Real-time client-side search by name or email
- **Pagination**: Navigate through 10 managers per page
- **Create Manager**: Modal form to create new managers
- **Edit Manager**: Modal to update manager name and email
- **Delete Manager**: Confirmation dialog before deletion
- **Responsive Design**: Desktop table view and mobile card layout
- **Notifications**: Toast notifications for success/error feedback
- **Loading States**: Proper loading indicators during operations

**User Flow:**

1. **List & Search**
   - View all managers in table or cards
   - Search by name or email in real-time
   - Pagination controls to browse through lists

2. **Create Manager**
   - Click "Add Manager" button
   - Fill in Name, Email, Password
   - Password validated for: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special
   - Click "Create Manager"
   - Success notification appears
   - List auto-refreshes with new manager

3. **Edit Manager**
   - Click "Edit" button on manager row/card
   - Edit Name and/or Email
   - Validation ensures valid inputs
   - Click "Update Manager"
   - Success notification appears
   - Modal closes automatically
   - List updates with new data

4. **Delete Manager**
   - Click "Delete" button on manager row/card
   - Confirmation dialog appears showing email
   - Click "Confirm" to delete or "Cancel" to abort
   - Success notification appears
   - Deleted manager removed from list

## Architecture

### Backend File Structure

**`backend/src/models/userModel.js`** - No changes required
- Existing functions handle manager data
- `getAllUsers()` used with role filter

**`backend/src/controllers/superadminController.js`** - **2 New Functions**

```javascript
// New function
async function getManagers(req, res, next) {
  // Retrieves all managers with optional search/pagination
  // Calls userModel.getAllUsers({ role: 'manager', ... })
  // Returns paginated results
}

// New function
async function updateManager(req, res, next) {
  // Updates manager name and/or email
  // Validates manager ID is numeric
  // Checks manager role is 'manager'
  // Validates email uniqueness
  // Calls userModel.updateUser()
  // Returns updated manager
}
```

**`backend/src/routes/superadminRoutes.js`** - **2 New Routes**

```javascript
// Get all managers with search/pagination
router.get('/managers', superadminController.getManagers);

// Update manager details
router.put('/managers/:id', superadminController.updateManager);
```

### Frontend File Structure

**`frontend/src/constants/endpoints.ts`** - Updated

```typescript
SUPERADMIN: {
  // ... existing endpoints
  MANAGERS: '/api/superadmin/managers',
  UPDATE_MANAGER: (id: number) => `/api/superadmin/managers/${id}`,
}
```

**`frontend/src/services/superadminApi.ts`** - Updated

```typescript
// Fetch managers with optional search and pagination
export async function fetchManagers(
  limit?: number,
  offset?: number,
  search?: string
): Promise<ApiResponse<any>>

// Update manager details
export async function updateManager(
  id: number,
  data: { name?: string; email?: string }
): Promise<ApiResponse<User>>

// Delete manager (shared endpoint)
export async function deleteManager(id: number): Promise<ApiResponse<void>>
```

**`frontend/src/app/superadmin/managers/page.tsx`** - Complete Rewrite

Features:
- Pagination: 10 managers per page
- Search: Client-side filtering by name/email
- Create Modal: Form with password validation
- Edit Modal: Update name and email
- Delete Confirmation: Dialog with manager email shown
- Responsive: Desktop table + mobile cards
- Notifications: Toast alerts for all operations
- Loading States: Proper handling during API calls

## Validation Rules

### Backend Validation - GET Managers
✅ Role: 'manager' (hardcoded)
✅ Pagination: limit and offset as integers
✅ Search: text pattern matching on name/email

### Backend Validation - Update Manager
✅ Manager ID must be numeric
✅ At least one field (name or email) required
✅ Manager must already have role 'manager'
✅ Email must be unique (not used by any other user)

### Frontend Validation - Create Manager
```typescript
createManagerSchema = {
  name: string().required(),
  email: string().email().required(),
  password: string().required() + password strength rules (8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special)
}
```

### Frontend Validation - Edit Manager
```typescript
editManagerSchema = {
  name: string().required().min(2),
  email: string().email().required()
}
```

## User Interface

### Desktop View

**Table Layout:**
```
┌─────────────────────────────────────────────────┐
│ Managers                    ➕ Add Manager      │
├──────────────────┬──────────────────┬──────────┤
│ Name             │ Email            │ Created  │
├──────────────────┼──────────────────┼──────────┤
│ John Manager     │ john@example.com │ 01-15-24 │
│ [Edit] [Delete]  │                  │          │
├──────────────────┼──────────────────┼──────────┤
│ Jane Manager     │ jane@example.com │ 01-14-24 │
│ [Edit] [Delete]  │                  │          │
└─────────────────────────────────────────────────┘
```

**Search & Pagination:**
```
┌─────────────────────────────────────────────┐
│ Search Managers                             │
│ [Search by name or email................] │
└─────────────────────────────────────────────┘

Page 1 of 5 (47 total managers)
[← Previous] [1] [2] [3] [4] [5] [Next →]
```

### Mobile View

**Card Layout:**
```
┌──────────────────────────────┐
│ JOHN MANAGER                 │
│                              │
│ john@example.com             │
│                              │
│ 01-15-2024                   │
│                              │
│ [Edit]          [Delete]     │
└──────────────────────────────┘
```

### Modals

**Create Manager Modal:**
```
┌────────────────────────────────────────┐
│ Create Manager                    × │
├────────────────────────────────────────┤
│                                        │
│ Full Name *                            │
│ [John Doe...........................]  │
│                                        │
│ Email *                                │
│ [john@example.com...................]  │
│                                        │
│ Password *                             │
│ [**.............]                      │
│ Min 8 chars, 1 uppercase, etc        │
│                                        │
├────────────────────────────────────────┤
│                   [Cancel] [Create]   │
└────────────────────────────────────────┘
```

**Edit Manager Modal:**
```
┌────────────────────────────────────────┐
│ Edit Manager                      ×   │
│ john@example.com                      │
├────────────────────────────────────────┤
│                                        │
│ Full Name *                            │
│ [John Smith...........................]  │
│                                        │
│ Email *                                │
│ [jonsmith@example.com...............]  │
│                                        │
├────────────────────────────────────────┤
│                 [Cancel] [Update]     │
└────────────────────────────────────────┘
```

### Notification Toasts

```
Success: "Manager john@example.com created successfully"
         (Green background, auto-hides after 3 seconds)

Error: "Failed to create manager"
       (Red background, auto-hides after 3 seconds)
```

## Data Flow

### Create Manager Flow
```
User clicks "Add Manager"
   ↓
isCreateModalOpen = true
↓
Modal displays with form
   ↓
User fills in: name, email, password
   ↓
User clicks "Create Manager"
   ↓
Formik validates using createManagerSchema
   ↓
handleCreateManager() called
   ↓
createMutation.mutateAsync(values)
   ↓
API POST /api/superadmin/create-manager
   ↓
Backend validates and creates user
   ↓
Success response with new user data
   ↓
Notification displayed
   ↓
queryClient.invalidateQueries(['superadmin', 'managers'])
   ↓
Modal closes
   ↓
useManagers hook refetches data
   ↓
List updates with new manager
```

### Edit Manager Flow
```
User clicks "Edit" on manager
   ↓
editManager = selected manager
   ↓
Modal displays with pre-filled form
   ↓
User edits name and/or email
   ↓
User clicks "Update Manager"
   ↓
Formik validates using editManagerSchema
   ↓
handleUpdateManager() called
   ↓
updateManager(id, {name, email})
   ↓
API PUT /api/superadmin/managers/:id
   ↓
Backend validates and updates user
   ↓
Success response with updated data
   ↓
Notification displayed
   ↓
queryClient.invalidateQueries(['superadmin', 'managers'])
   ↓
Modal closes after 500ms
   ↓
useManagers hook refetches data
   ↓
List updates with new details
```

### Delete Manager Flow
```
User clicks "Delete" on manager
   ↓
deleteConfirm = { open: true, user: manager }
   ↓
Confirmation dialog appears
   ↓
User clicks "Confirm Delete"
   ↓
handleDeleteConfirm()
   ↓
deleteMutation.mutateAsync(manager.id)
   ↓
API DELETE /api/superadmin/users/:id
   ↓
Backend validates and deletes user
   ↓
Success response
   ↓
Notification displayed
   ↓
queryClient.invalidateQueries(['superadmin', 'managers'])
   ↓
Dialog closes
   ↓
useManagers hook refetches data
   ↓
List updates (deleted manager removed)
```

## Error Handling

### Backend Errors

| Status | Error | Scenario |
|--------|-------|----------|
| 400 | Invalid manager ID | ID is not numeric |
| 400 | Manager is not a manager | Role is not 'manager' |
| 400 | At least one fieldmust be provided | Neither name nor email in update |
| 400 | Email is already in use | Email belongs to another user |
| 404 | Manager not found | ID doesn't exist |
| 403 | Cannot delete another superadmin | Trying to delete superadmin |
| 403 | You cannot delete your own account | Attempting self-deletion |

### Frontend Error Display

All errors display as red toast notification at top-right of screen for 3 seconds. Modal remains open for user to retry or cancel.

## API Reference

### Get Managers
```
GET /api/superadmin/managers?search=john&limit=10&offset=0

Response:
{
  "ok": true,
  "data": {
    "users": [...],
    "total": 47,
    "count": 10,
    "limit": 10,
    "offset": 0
  }
}
```

### Create Manager
```
POST /api/superadmin/create-manager

Body: { "name": "John", "email": "john@example.com", "password": "SecurePass123!" }

Response:
{
  "ok": true,
  "message": "Manager created successfully",
  "data": { "id": 2, "name": "John", "email": "john@example.com", "role": "manager", ... }
}
```

### Update Manager
```
PUT /api/superadmin/managers/:id

Body: { "name": "John Smith", "email": "johnsmith@example.com" }

Response:
{
  "ok": true,
  "message": "Manager updated successfully",
  "data": { "id": 2, "name": "John Smith", "email": "johnsmith@example.com", ... }
}
```

### Delete Manager
```
DELETE /api/superadmin/users/:id

Response:
{
  "ok": true,
  "message": "User john@example.com deleted successfully",
  "data": { "id": 2 }
}
```

## Testing Scenarios

### Test 1: Create Manager
1. Click "+ Add Manager" button
2. Fill: John Manager, john@example.com, SecurePass123!
3. Click "Create Manager"
4. ✅ Success notification appears
5. ✅ List refreshes with new manager

### Test 2: Edit Manager
1. Click "Edit" on a manager
2. Change name to "Johnny Manager"
3. Click "Update Manager"
4. ✅ Success notification appears
5. ✅ List updates with new name
6. ✅ Modal closes

### Test 3: Delete Manager
1. Click "Delete" on a manager
2. Confirm dialog appears
3. Click "Confirm Delete"
4. ✅ Success notification appears
5. ✅ Manager removed from list

### Test 4: Search
1. Type "john" in search box
2. ✅ List filters to show only managers with "john" in name/email
3. Type full email "john@example.com"
4. ✅ Only exact match displays
5. Clear search
6. ✅ All managers display again

### Test 5: Pagination
1. Page 1 shows first 10 managers
2. Click "Next"
3. ✅ Page 2 shows next 10 managers
4. Click page number directly
5. ✅ Jumps to that page
6. Click "Previous"
7. ✅ Goes back to previous page

### Test 6: Validation Errors
1. Try create with duplicate email
2. ✅ Error notification: "Email is already in use"
3. Try create with weak password
4. ✅ Error notification: "Password must contain..."

### Test 7: Mobile Responsiveness
1. View on mobile device
2. ✅ Cards display instead of table
3. Search and pagination work
4. ✅ Edit/Delete buttons properly sized

## Performance Considerations

✅ **Pagination**
- 10 managers per page
- Reduces DOM elements rendered
- Faster API responses

✅ **Search**
- Client-side filtering
- No API calls needed
- Instant results

✅ **React Query**
- Cache invalidation on mutations
- Automatic refetch
- Optimized data fetching

✅ **Responsive Design**
- Desktop: Full table
- Mobile: Lightweight cards
- Hidden/shown with Tailwind breakpoints

## Security Considerations

✅ **Access Control**
- All routes require super admin role
- User must be authenticated
- JWT token validation

✅ **Data Validation**
- Input sanitization on frontend
- Backend validation required
- Parameterized queries prevent SQL injection

✅ **Safety Rules**
- Cannot delete self
- Cannot delete other superadmins
- Email uniqueness enforced

## Related Features

- **User Management** - General user CRUD operations
- **HR Management** - HR staff management
- **Dashboard** - Statistics including manager count
- **Attendance** - Managers may track attendance
- **Reports** - Managers can access reports

## Files Modified/Created

**Backend:**
- `backend/src/controllers/superadminController.js` - Added getManagers() and updateManager()
- `backend/src/routes/superadminRoutes.js` - Added GET /managers and PUT /managers/:id routes
- `backend/src/models/userModel.js` - No changes (uses existing functions)

**Frontend:**
- `frontend/src/app/superadmin/managers/page.tsx` - Complete CRUD interface page
- `frontend/src/constants/endpoints.ts` - Added MANAGERS and UPDATE_MANAGER endpoints
- `frontend/src/services/superadminApi.ts` - Updated fetchManagers(), added updateManager(), deleteManager()
- `frontend/src/hooks/useSuperAdmin.ts` - No changes (hooks already exist)
- `frontend/src/schemas/superadmin.ts` - No changes (validation schema already exists)

---

**Status:** ✅ Production Ready
**Last Updated:** 30 April 2026
**Test Coverage:** 7 comprehensive test scenarios documented
