# User Management - Quick Start Guide

## What's Been Implemented

### Backend Enhancements (Node.js/Express)

✅ **Enhanced `/api/superadmin/users` endpoint**

**Features:**
- Pagination: `?limit=10&offset=0`
- Search: `?search=john` (searches name AND email)
- Role Filter: `?role=manager`
- Combined: `?role=manager&search=john&limit=10&offset=0`

**Response includes:**
- `users` - Array of user objects
- `total` - Total count of users (accounting for filters)
- `count` - Count of users in current page
- `limit` - Items per page
- `offset` - Current offset

**Example Response:**
```json
{
  "ok": true,
  "data": {
    "users": [
      {"id": 1, "name": "John Doe", "email": "john@example.com", "role": "manager", "created_at": "2024-01-15"},
      {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "hr", "created_at": "2024-01-14"}
    ],
    "total": 45,
    "count": 2,
    "limit": 10,
    "offset": 0
  }
}
```

### Frontend Implementation (Next.js/React)

✅ **Complete User Management Page** at `/superadmin/users`

**Features:**

1. **Search Bar**
   - Real-time search by name or email
   - Case-insensitive matching
   - Client-side filtering

2. **Role Filter**
   - Dropdown to filter by role
   - Options: All Roles, Manager, HR, Employee, Super Admin
   - Combined with search

3. **Results Display**
   - Shows "Showing X of Y users"
   - "Clear Filters" button to reset

4. **Desktop Table View** (≥ 768px)
   - Columns: Name, Email, Role, Created Date
   - Edit/Delete action buttons
   - Role badges with color coding

5. **Mobile Card View** (< 768px)
   - One user per card
   - All info in card format
   - Edit/Delete buttons at bottom
   - Optimized for touch

6. **Pagination**
   - Page controls: Previous | 1 2 3 4 5 | Next
   - Shows "Page X of Y (Z total users)"
   - Disabled states when at first/last page
   - Direct page number clicks

7. **User Actions**
   - **Edit:** Click "Edit" to open modal
     - Can change name and role
     - Save changes
   - **Delete:** Click "Delete"
     - Confirmation dialog appears
     - Confirm or cancel

8. **States Handling**
   - Loading skeleton while fetching
   - Error message with helpful text
   - Empty state when no results
   - Proper transitions

## Testing the Feature

### Test the Backend API

```bash
# Get all users with pagination
curl "http://localhost:4000/api/superadmin/users?limit=10&offset=0" \
  -H "Cookie: token=YOUR_JWT_TOKEN"

# Search by name
curl "http://localhost:4000/api/superadmin/users?search=john" \
  -H "Cookie: token=YOUR_JWT_TOKEN"

# Filter by role
curl "http://localhost:4000/api/superadmin/users?role=manager" \
  -H "Cookie: token=YOUR_JWT_TOKEN"

# Combined search and filter
curl "http://localhost:4000/api/superadmin/users?search=john&role=manager&limit=5&offset=0" \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

### Test the Frontend

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Navigate to Users Page**
   - Go to: `http://localhost:3000/superadmin/users`
   - Login as super admin first

4. **Test Scenarios**

   **Scenario 1: Search**
   - Type "john" in search box
   - Should filter users in real-time
   - Try searching by email too

   **Scenario 2: Role Filter**
   - Select "Manager" from dropdown
   - Should show only managers
   - Combine with search

   **Scenario 3: Pagination**
   - Create 20+ users
   - Click "Next" page
   - Should load next 10 users
   - Click page numbers directly

   **Scenario 4: Edit User**
   - Click "Edit" on any user
   - Change their name or role
   - Click "Save Changes"
   - List should update

   **Scenario 5: Delete User**
   - Click "Delete" on any user
   - Confirmation dialog appears
   - Click "Delete" to confirm
   - User should be removed

   **Scenario 6: Mobile View**
   - Open DevTools (F12)
   - Toggle Device Toolbar
   - Change screen size to mobile
   - Should see card layout instead of table

## API Integration Points

### 1. Search Parameter (NEW)
```typescript
// Frontend sends:
GET /api/superadmin/users?search=john&limit=10&offset=0

// Backend processes:
// SELECT ... WHERE (LOWER(name) LIKE '%john%' OR LOWER(email) LIKE '%john%')
// Returns matching users
```

### 2. Total Count (ENHANCED)
```typescript
// Backend now returns:
{
  "total": 45,        // Total users matching filter
  "count": 10,        // Users in this page
  "limit": 10,        // Page size
  "offset": 0         // Current offset
}

// Frontend calculates:
totalPages = Math.ceil(total / limit)  // 45 / 10 = 5 pages
```

### 3. Pagination (IMPLEMENTED)
```typescript
// Frontend-controlled:
const currentPage = 1;
const limit = 10;
const offset = (currentPage - 1) * limit;  // 0

// Backend query:
GET /api/superadmin/users?limit=10&offset=0
```

## File Changes Summary

### Backend Changes

**`backend/src/models/userModel.js`**
- Enhanced `getAllUsers()` function
- Added search support
- Returns `{ users, total }` object

**`backend/src/controllers/superadminController.js`**
- Updated `getUsers()` controller
- Added search parameter handling
- Returns pagination metadata

### Frontend Changes

**`frontend/src/app/superadmin/users/page.tsx`**
- Complete page rewrite
- Search bar with real-time filtering
- Role filter dropdown
- Pagination controls
- Desktop table + mobile cards
- Edit/Delete modals
- Responsive design

**`frontend/src/services/superadminApi.ts`**
- Updated `fetchUsers()` to support search

**`frontend/src/constants/endpoints.ts`**
- Already had endpoint definition
- Ready for search parameter

## Key Design Decisions

1. **Client-side Search**
   - Search/role filtering done on frontend
   - Reduces API calls
   - Instant user feedback
   - Pagination still server-side

2. **Responsive Design**
   - Desktop: Table view with full details
   - Mobile: Card view one per card
   - Tablets: Responsive table

3. **Pagination**
   - 10 users per page (configurable)
   - Page-based navigation
   - Previous/Next buttons
   - Direct page number clicks

4. **User Feedback**
   - Live results counter
   - Loading states
   - Error messages
   - Empty states
   - Success notifications

## Deployment

### Frontend (Vercel)
```bash
# Already configured in vercel.json
npm run build
# Deploy to Vercel
```

### Backend (Railway)
```bash
# Backend API is already deployed
# Just ensure .env has production database
```

## Performance Notes

- ✅ React Query caching
- ✅ Client-side filtering (no extra API calls)
- ✅ Pagination (not loading all users)
- ✅ Lazy loading components
- ✅ Optimized renders with useMemo

## Security Notes

- ✅ Backend validates super admin role
- ✅ Parameterized queries (no SQL injection)
- ✅ Frontend XSS protection (React)
- ✅ CSRF tokens (Next.js)
- ✅ HTTPOnly cookies for JWT

---

## Quick Reference Commands

```bash
# Start development
cd backend && npm run dev &
cd frontend && npm run dev

# Access User Management
http://localhost:3000/superadmin/users

# Backend API
http://localhost:4000/api/superadmin/users

# Test API calls
curl "http://localhost:4000/api/superadmin/users?search=john" -H "Cookie: token=JWT"
```

Status: ✅ READY TO USE
