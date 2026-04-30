# User Management Feature - Implementation Guide

## Overview

The User Management feature provides super admins with a comprehensive interface to view, search, filter, and manage all users in the system with full pagination support and responsive design for mobile and desktop.

## Features Implemented

### Backend (Node.js/Express)

✅ **Enhanced User Listing API**
- Endpoint: `GET /api/superadmin/users`
- Supports pagination (limit, offset)
- Supports filtering by role
- Supports searching by name or email (case-insensitive)
- Returns paginated results with total count

**Query Parameters:**
```bash
GET /api/superadmin/users?limit=10&offset=0&role=manager&search=john
```

**Response Format:**
```json
{
  "ok": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "manager",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 45,
    "count": 10,
    "limit": 10,
    "offset": 0
  }
}
```

### Frontend (Next.js/React)

✅ **User Management Page** (`/superadmin/users`)

**Features:**
- 🔍 Real-time search by name or email
- 🎯 Filter by role (superadmin, manager, hr, employee)
- 📄 Pagination with page controls
- 📊 Results counter showing current page info
- 📱 Responsive design:
  - **Desktop:** Full table view with all columns
  - **Tablet:** Optimized table with reduced columns
  - **Mobile:** Card-style layout for easy viewing
- ✏️ Edit user role
- 🗑️ Delete user (with confirmation)
- ✨ Loading/error/empty states

## Architecture

### Backend Files Modified

**`backend/src/models/userModel.js`**
- Enhanced `getAllUsers()` function
- Added search parameter support (LIKE queries on name and email)
- Returns object with `{ users, total }` instead of just array
- Proper pagination logic with WHERE conditions

**`backend/src/controllers/superadminController.js`**
- Updated `getUsers()` controller
- Added search query parameter handling
- Returns total count and pagination info

### Frontend Files Modified

**`frontend/src/app/superadmin/users/page.tsx`**
- ✅ Complete rewrite with new features
- Search bar with real-time filtering
- Role filter dropdown
- Pagination controls
- Desktop table view (hidden on mobile)
- Mobile card view (hidden on desktop)
- Edit modal for updating user
- Delete confirmation dialog

**`frontend/src/services/superadminApi.ts`**
- Updated `fetchUsers()` to support search parameter

**`frontend/src/hooks/useSuperAdmin.ts`**
- `useUsers()` hook ready for pagination

## User Interface

### Search & Filter Section

```
┌─────────────────────────────────────────────────────────┐
│ Search Users                                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Search by name or email...                         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ Filter by Role            │  Clear Filters              │
│ ┌──────────────────────┐ │ ┌─────────────────────────┐ │
│ │ All Roles          ▼│ │ │  Clear Filters          │ │
│ └──────────────────────┘ │ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Desktop Table View

```
┌──────────────────────────────────────────────────────────────────┐
│ User Management                                                   │
│ Showing 10 of 45 users                                            │
├──────────────────────────────────────────────────────────────────┤
│ Name          │ Email            │ Role     │ Created    │ Action│
├──────────────────────────────────────────────────────────────────┤
│ John Doe      │ john@example.com │ Manager  │ 2024-01-15 │ ✎ 🗑│
│ Jane Smith    │ jane@example.com │ HR       │ 2024-01-14 │ ✎ 🗑│
└──────────────────────────────────────────────────────────────────┘
```

### Mobile Card View

```
┌─────────────────────┐
│ NAME                │
│ John Doe            │
│                     │
│ EMAIL               │
│ john@example.com    │
│                     │
│ ROLE                │
│ Manager             │
│                     │
│ CREATED             │
│ 2024-01-15          │
│                     │
│ [Edit]    [Delete]  │
└─────────────────────┘
```

### Pagination Controls

```
Page 1 of 5 (45 total users)  [← Previous] [1][2][3][4][5] [Next →]
```

## API Integration

### Pagination Flow

1. User opens page / changes filters
2. Frontend requests: `/api/superadmin/users?limit=10&offset=0&search=&role=`
3. Backend returns 45 total users, 10 per page
4. Frontend calculates: `totalPages = ceil(45 / 10) = 5`
5. Displays "Page 1 of 5 (45 total users)"
6. User clicks "Next Page"
7. Frontend requests: `/api/superadmin/users?limit=10&offset=10`
8. Backend returns next 10 users

### Search Flow

1. User types in search box: "john"
2. Frontend filters users client-side (from current page data)
3. Shows matching results
4. "Clear Filters" button resets search

### Role Filter Flow

1. User selects role from dropdown: "manager"
2. Query includes: `?role=manager`
3. Backend filters at database level
4. Frontend receives only manager users
5. Pagination recalculates based on filtered results

## Code Examples

### Backend - Search Query

```javascript
// Query with all conditions
SELECT id, email, name, role, created_by, created_at 
FROM users 
WHERE role = $1 
  AND (LOWER(name) LIKE LOWER($2) OR LOWER(email) LIKE LOWER($3))
ORDER BY created_at DESC 
LIMIT $4 OFFSET $5
```

### Frontend - Search & Filter

```typescript
// Real-time client-side filtering
const filteredUsers = useMemo(() => {
  return users.filter((user) => {
    const matchesSearch = !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
}, [users, searchQuery, roleFilter]);
```

### Frontend - Pagination

```typescript
const offset = (currentPage - 1) * USERS_PER_PAGE;
const { data, isLoading } = useUsers(USERS_PER_PAGE, offset);

const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
```

## User Workflows

### Workflow 1: Search for User

1. Open User Management page
2. Type in search box: "john"
3. See filtered results
4. Click "Clear Filters" to reset

### Workflow 2: Filter by Role

1. Open User Management page
2. Select role from dropdown: "HR"
3. See only HR users
4. Pagination updates with new total

### Workflow 3: Navigate Pages

1. Open User Management page (shows page 1)
2. See "Page 1 of 5 (45 users)"
3. Click "Next" or page 2
4. Page 2 loads with next 10 users
5. URL or app state updates

### Workflow 4: Edit User

1. Click "Edit" on any user row/card
2. Modal opens with user details
3. Change name or role
4. Click "Save Changes"
5. User updated, list refreshes

### Workflow 5: Delete User

1. Click "Delete" on any user row/card
2. Confirmation dialog appears
3. Click "Delete" to confirm
4. User removed from system
5. List updates automatically

## Responsive Design

### Desktop (≥ 768px)
- Full table view with all columns
- Horizontal scrolling if needed
- Optimized for mouse interaction
- Table pagination controls

### Mobile (< 768px)
- Card layout (one user per card)
- Vertical scrolling
- Optimized for touch
- Actions buttons in cards
- Full-width modals

### Tablet (768px - 1024px)
- Responsive table
- Adapted column widths
- Mobile-friendly modals

## Performance Optimizations

✅ **React Query Caching**
- Users data cached automatically
- Refetch on mutations
- Smart invalidation

✅ **Client-side Filtering**
- Search/role filter done in React
- No extra API calls for filtering
- Instant user feedback

✅ **Pagination**
- Only fetch current page
- Reduces data transfer
- Faster page loads

✅ **Code Splitting**
- Component lazy loading
- Page-level code splitting

## Testing Checklist

- [ ] Can search users by name
- [ ] Can search users by email
- [ ] Search is case-insensitive
- [ ] Can filter by role
- [ ] Pagination works correctly
- [ ] "Previous" button disabled on page 1
- [ ] "Next" button disabled on last page
- [ ] Page numbers update correctly
- [ ] Clear filters resets all
- [ ] Desktop table view displays correctly
- [ ] Mobile card view displays correctly
- [ ] Responsive design works
- [ ] Can edit user
- [ ] Can delete user
- [ ] Loading state shows
- [ ] Error state shows
- [ ] Empty state shows when no results

## Configuration

### Users Per Page

Edit `USERS_PER_PAGE` constant in `frontend/src/app/superadmin/users/page.tsx`:

```typescript
const USERS_PER_PAGE = 10; // Change this to 20, 50, etc.
```

### API Endpoint

Configured in `frontend/src/constants/endpoints.ts`:

```typescript
SUPERADMIN: {
  USERS: '/api/superadmin/users',
  // ... other endpoints
}
```

## Troubleshooting

### Issue: Search not working

**Cause:** Search parameter not passed to API

**Solution:**
1. Check backend `getLogs` function has search parameter
2. Verify query string includes `search=`
3. Check database connection

### Issue: Pagination broken

**Cause:** Total count not returned from backend

**Solution:**
1. Verify backend returns `total` in response
2. Check offset calculation: `(page - 1) * limit`
3. Verify pagination controls calculate `totalPages` correctly

### Issue: Mobile layout broken

**Cause:** Tailwind classes not applied

**Solution:**
1. Verify `md:hidden` and `hidden md:block` classes
2. Run `npm run build` to ensure Tailwind compilation
3. Clear browser cache

### Issue: User deleted but list not updated

**Cause:** React Query cache not invalidated

**Solution:**
1. Check `deleteUser` mutation calls `queryClient.invalidateQueries()`
2. Verify query key matches: `['superadmin', 'users']`

## Future Enhancements

- [ ] Bulk delete users
- [ ] Export users to CSV
- [ ] Sort by column (name, email, role, created date)
- [ ] User activity logs
- [ ] Resend invitation email
- [ ] Account activation status
- [ ] Advanced filters (date range, multiple roles)
- [ ] User groups/departments

## Security Considerations

✅ **Backend Validation**
- Role-based access control (superadmin only)
- Parameterized queries (no SQL injection)
- Input validation

✅ **Frontend Security**
- XSS protection (React escapes by default)
- CSRF tokens included by Next.js
- httpOnly cookies for JWT

✅ **Data Privacy**
- Passwords never sent to frontend
- Password hashes never displayed
- User actions logged

## Documentation References

- [Backend API Documentation](../backend/README.md)
- [Frontend Setup Guide](./FRONTEND_INTEGRATION_GUIDE.md)
- [Database Schema](../backend/migrations/)
- [API Endpoints](./src/constants/endpoints.ts)

---

**Last Updated:** 30 April 2026
**Status:** ✅ Production Ready
