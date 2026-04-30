# Super Admin Dashboard - Frontend Implementation

This is the frontend implementation of the Super Admin Dashboard for the DevFlx Employee Attendance Management System.

## Features

✅ **Dashboard Overview** - Real-time statistics showing:
- Total users count
- Manager count
- HR count  
- Employee count
- Quick action buttons

✅ **Manager Management** - Create, view, and delete managers
✅ **HR Management** - Create, view, and delete HR users
✅ **User Management** - View all users, filter by role, edit roles, delete users
✅ **Attendance Monitoring** - Placeholder for attendance tracking (coming soon)
✅ **Reports** - Placeholder for report generation (coming soon)

## Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: React Query (TanStack Query)
- **Form Management**: Formik + Yup
- **API Client**: Typed Fetch API

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── superadmin/           # Super Admin pages
│   │       ├── page.tsx          # Dashboard
│   │       ├── managers/         # Manager management
│   │       ├── hr/               # HR management
│   │       ├── users/            # User management
│   │       ├── attendance/       # Attendance (placeholder)
│   │       └── reports/          # Reports (placeholder)
│   ├── components/
│   │   └── superadmin/           # Super Admin components
│   │       ├── Layout.tsx        # Main layout wrapper
│   │       ├── Sidebar.tsx       # Navigation sidebar
│   │       ├── Navbar.tsx        # Top navbar
│   │       ├── StatCard.tsx      # Dashboard stat cards
│   │       ├── DataTable.tsx     # Reusable data table
│   │       ├── Modal.tsx         # Modal dialog
│   │       ├── Badge.tsx         # Role/status badges
│   │       ├── FormFields.tsx    # Form input components
│   │       ├── DeleteConfirmation.tsx  # Delete confirmation
│   │       └── States.tsx        # Loading/Error/Empty states
│   ├── constants/
│   │   ├── endpoints.ts          # API endpoints
│   │   └── superadmin.ts         # UI constants
│   ├── types/
│   │   └── superadmin.ts         # TypeScript interfaces
│   ├── services/
│   │   └── superadminApi.ts      # API service with typed calls
│   ├── hooks/
│   │   └── useSuperAdmin.ts      # React Query hooks
│   ├── schemas/
│   │   └── superadmin.ts         # Yup validation schemas
│   └── ...
```

## Setup & Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Environment Setup

1. **Create `.env.local` file** in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# Optional: Analytics, etc.
NEXT_PUBLIC_APP_ENV=development
```

2. **Install dependencies**:

```bash
cd frontend
npm install
```

3. **Run development server**:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting (if configured)
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## Authentication Flow

1. User logs in at `/login`
2. Backend issues JWT token in httpOnly cookie
3. Token is automatically sent with each API request
4. Super admin role is verified by backend middleware
5. If unauthorized, redirect to login page

## API Integration

### Endpoints Used

All endpoints are centralized in `src/constants/endpoints.ts`:

```typescript
// Dashboard
GET /api/superadmin/dashboard
// Response: { totalUsers, breakdown: { superadmins, managers, hr, employees } }

// Users
GET /api/superadmin/users?role=manager&limit=10&offset=0
GET /api/superadmin/users/:id
PUT /api/superadmin/users/:id
DELETE /api/superadmin/users/:id

// Create Users
POST /api/superadmin/create-manager      # { name, email, password }
POST /api/superadmin/create-hr           # { name, email, password }
POST /api/superadmin/create-employee     # { name, email, password }

// Validation
POST /api/superadmin/verify-password     # { password }
```

### Error Handling

All API calls follow this pattern:

```typescript
try {
  const response = await fetchDashboard();
  if (!response.ok) {
    // Handle error: response.error contains error message
  } else {
    // Use response.data
  }
} catch (error) {
  // Network/parsing errors
}
```

## Form Validation

All forms use **Yup** schemas defined in `src/schemas/superadmin.ts`:

```typescript
// Password requirements:
// - Minimum 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character
```

Forms are managed with **Formik**:

```typescript
<Formik
  initialValues={{ name: '', email: '', password: '' }}
  validationSchema={createManagerSchema}
  onSubmit={handleCreateManager}
>
  {/* Form fields with validation */}
</Formik>
```

## Component Usage Examples

### StatCard Component

```typescript
<StatCard
  title="Total Users"
  value={123}
  icon="👥"
  color="blue"
  onClick={() => router.push('/superadmin/users')}
/>
```

### Modal Component

```typescript
<Modal
  isOpen={isModalOpen}
  title="Create Manager"
  onClose={() => setIsModalOpen(false)}
>
  {/* Modal content */}
</Modal>
```

### DataTable Component

```typescript
<DataTable
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
  ]}
  data={users}
  actions={(user) => (
    <button onClick={() => deleteUser(user.id)}>Delete</button>
  )}
/>
```

## Responsive Design

All pages are responsive with Tailwind breakpoints:

- **Desktop** (lg): 4 columns for stat cards
- **Tablet** (md): 2 columns for stat cards
- **Mobile** (sm): 1 column (stacked)

## Key Features Implementation

### Dashboard Page (`/superadmin`)
- Shows 5 stat cards (clickable)
- Quick action buttons to create managers/HR
- System status information
- User count breakdown

### Manager Management (`/superadmin/managers`)
- List all managers in table
- Create new manager (modal form)
- Delete manager (with confirmation)
- Form validation with Yup

### HR Management (`/superadmin/hr`)
- List all HR users
- Create new HR user
- Delete HR user
- Same pattern as managers

### User Management (`/superadmin/users`)
- List all users with role filtering
- Search by name/email
- Edit user role
- Delete user
- Shows role badges

### Attendance Monitoring (`/superadmin/attendance`)
- Placeholder for future implementation
- Will show today's attendance status
- Present/Absent/Late counts

### Reports (`/superadmin/reports`)
- Placeholder for future implementation
- Daily report generation
- Monthly report generation
- Employee-specific reports

## React Query Cache Management

All data is cached using React Query with smart invalidation:

```typescript
// When user is created, dashboard and users list are automatically refetched
queryClient.invalidateQueries({ queryKey: ['superadmin', 'dashboard'] });
queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
```

Query keys follow this pattern:

```typescript
superadminKeys.dashboard()           // ['superadmin', 'dashboard']
superadminKeys.users()               // ['superadmin', 'users']
superadminKeys.usersByRole('manager') // ['superadmin', 'users', 'manager']
```

## Data Types

All data structures are TypeScript interfaces in `src/types/superadmin.ts`:

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;  // 'superadmin' | 'manager' | 'hr' | 'employee'
  created_by?: number;
  created_at: string;
}

export interface DashboardData {
  totalUsers: number;
  breakdown: {
    superadmins: number;
    managers: number;
    hr: number;
    employees: number;
  };
}
```

## Cursor Rules Compliance

✅ **All cursor rules followed:**
- ✅ TypeScript only (.ts/.tsx files)
- ✅ Types in dedicated `src/types/` folder
- ✅ Constants in dedicated `src/constants/` folder
- ✅ API endpoints never hard-coded
- ✅ React Query for all data fetching
- ✅ Custom hooks for queries/mutations
- ✅ Yup validation schemas
- ✅ Formik for form management
- ✅ Feature-based folder organization
- ✅ No hard-coded strings (using constants)
- ✅ Modular, reusable components

## Troubleshooting

### API Connection Errors

**Problem**: "Failed to load dashboard"

**Solution**:
1. Check backend is running: `http://localhost:4000`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Ensure you're logged in (JWT cookie set)

### Form Validation Not Working

**Problem**: Form submits without validation

**Solution**:
1. Check Yup schema is properly imported
2. Verify Formik `validationSchema` prop is set
3. Ensure field names match schema definitions

### Modal Not Closing

**Problem**: Modal stays open after submit

**Solution**:
1. Call `setIsModalOpen(false)` in success handler
2. Check mutation success callback is firing
3. Verify no errors in console

## Future Enhancements

- [ ] Advanced filtering and search
- [ ] CSV/PDF export for reports
- [ ] Bulk user operations
- [ ] User activity logs
- [ ] Department management
- [ ] Advanced attendance analytics
- [ ] Email notifications
- [ ] Two-factor authentication

## Performance Optimization

- React Query caching reduces API calls
- Lazy loading for images/heavy components
- CSS-in-JS (Tailwind) for minimal bundle
- Pagination for large user lists
- Query stale time: 5 minutes (configured)

## Security Considerations

- JWT tokens stored in httpOnly cookies (backend handles)
- All API calls include credentials
- Password validation enforced on frontend + backend
- CSRF protection (from Next.js)
- XSS protection (React escapes by default)
- Role-based access (backend enforces)

## Support & Debugging

For debugging:
1. Check browser DevTools Network tab for API calls
2. Check React Query DevTools (if installed)
3. Look for error messages in toast notifications
4. Check server logs in backend terminal

## License

This project is part of the DevFlx Employee Attendance Management System.
