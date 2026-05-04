# Employee Dashboard - Quick Reference Guide

## Quick Start

### Access the Dashboard
```
http://localhost:3000/employee/dashboard
```

### Component Imports
```typescript
import {
  EmployeeLayout,
  EmployeeNavbar,
  EmployeeSidebar,
  WelcomeCard,
  AttendanceActionCard,
  TodayAttendanceCard,
  AttendanceSummaryCard,
  RecentAttendanceTable,
} from '@/components/employee';
```

---

## Component Examples

### WelcomeCard
```typescript
<WelcomeCard employeeName="John Doe" />
```
**Features**: Dynamic greeting, live clock, responsive layout

---

### AttendanceActionCard
```typescript
const [isCheckedIn, setIsCheckedIn] = useState(false);

<AttendanceActionCard
  isCheckedIn={isCheckedIn}
  onCheckIn={async () => {
    await fetch('/api/attendance/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workType: 'office' })
    });
    setIsCheckedIn(true);
  }}
  onCheckOut={async () => {
    await fetch('/api/attendance/check-out', { method: 'POST' });
    setIsCheckedIn(false);
  }}
/>
```
**Features**: Work type selector, large buttons, loading states

---

### TodayAttendanceCard
```typescript
<TodayAttendanceCard
  checkInTime="09:00 AM"
  checkOutTime="06:00 PM"
  workType="office"
  status="checked-out"
  workingHours="8h 45m"
/>
```
**Features**: 5-column grid, status indicators, working hours

---

### AttendanceSummaryCard (Stat Card)
```typescript
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <AttendanceSummaryCard label="Present Days" value={18} icon="✓" color="green" />
  <AttendanceSummaryCard label="Absent Days" value={2} icon="✕" color="red" />
  <AttendanceSummaryCard label="Late Arrivals" value={3} icon="⏰" color="orange" />
  <AttendanceSummaryCard label="Work From Home" value={5} icon="🏠" color="blue" />
</div>
```
**Features**: Color coded, flexible grid, icon support

---

### RecentAttendanceTable
```typescript
<RecentAttendanceTable
  data={[
    {
      date: 'May 3, 2026',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      workType: 'WFO',
      status: 'Present'
    },
    // ... more records
  ]}
  loading={false}
/>
```
**Features**: Desktop table + mobile cards, status badges, loading skeleton

---

## Real Data Integration

### 1. Fetch User on Mount
```typescript
'use client';
import { useAuth } from '@/hooks/useAuth';

export default function EmployeeDashboard() {
  const { user, loading } = useAuth();
  
  if (loading) return <EmployeeDashboardLoading />;
  
  return <WelcomeCard employeeName={user?.name} />;
}
```

### 2. Create Custom Hook for Attendance
```typescript
// hooks/useAttendance.ts
export function useAttendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkIn = async (workType) => {
    setLoading(true);
    const res = await fetch('/api/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ workType })
    });
    const result = await res.json();
    setData(result);
    setLoading(false);
    return result;
  };

  return { data, loading, checkIn };
}
```

### 3. Use in Dashboard
```typescript
export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { data, loading, checkIn } = useAttendance();

  return (
    <EmployeeLayout>
      <WelcomeCard employeeName={user?.name} />
      <AttendanceActionCard
        isCheckedIn={data?.isCheckedIn}
        onCheckIn={() => checkIn('office')}
        loading={loading}
      />
      <TodayAttendanceCard {...data?.today} />
    </EmployeeLayout>
  );
}
```

---

## Responsive Behavior

### Mobile (< 640px)
- Sidebar: FAB button (bottom-right)
- Navbar: Single column, horizontal scroll nav
- Layout: 1 column
- Tables: Card view
- Buttons: Full width

### Tablet (640px - 1024px)
- Sidebar: Visible inline
- Navbar: 2-line layout
- Layout: 2-3 columns
- Tables: 50% table width
- Buttons: Auto width

### Desktop (> 1024px)
- Sidebar: Visible, collapsible
- Navbar: Single line, horizontal
- Layout: 3 columns
- Tables: Full width
- Buttons: Auto width

---

## API Endpoints Required

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/attendance/check-in` | POST | `{ workType }` | `{ checkInTime, success }` |
| `/api/attendance/check-out` | POST | - | `{ checkOutTime, workingHours, success }` |
| `/api/attendance/today` | GET | - | `{ checkIn, checkOut, workType, status, workingHours }` |
| `/api/attendance/summary` | GET | - | `{ presentDays, absentDays, lateArrivals, workFromHomeDays }` |
| `/api/attendance/recent?limit=5` | GET | - | `[{ date, checkIn, checkOut, workType, status }]` |

---

## Styling & Customization

### Available Colors
- `blue` (primary)
- `green` (success)
- `red` (danger)
- `orange` (warning)

### Available Sizes
- Mobile: Single column
- Tablet: 2 columns
- Desktop: 3 columns

### Tailwind Classes Used
- Breakpoints: `sm` (640px), `lg` (1024px)
- Padding: `p-6` (1.5rem), `p-8` (2rem)
- Gaps: `gap-4`, `gap-6`
- Shadows: `shadow-sm`
- Borders: `border-blue-100`

---

## Navigation Routes

```typescript
import { ROUTES } from '@/constants/routes';

// All employee routes:
ROUTES.EMPLOYEE.HOME          // /employee
ROUTES.EMPLOYEE.DASHBOARD     // /employee/dashboard
ROUTES.EMPLOYEE.ATTENDANCE    // /employee/attendance
ROUTES.EMPLOYEE.ATTENDANCE_HISTORY // /employee/attendance-history
ROUTES.EMPLOYEE.LEAVE_REQUESTS // /employee/leave-requests
ROUTES.EMPLOYEE.PROFILE       // /employee/profile
```

---

## Performance Tips

1. **Data Fetching**: Use React Query for caching
   ```typescript
   const { data } = useQuery(['attendance', 'today'], () =>
     fetch('/api/attendance/today').then(r => r.json())
   );
   ```

2. **Loading States**: Show skeleton while loading
   ```typescript
   export loading from './loading.tsx';
   ```

3. **Memoization**: Components already optimized
   - Sidebar uses `useState` for toggle
   - Cards use inline handlers

4. **Image Optimization**: Use `next/image` for avatars

---

## Troubleshooting

### Sidebar Not Closing on Mobile
- Ensure screen width < 1024px
- Check if FAB button is visible
- Verify 'lg:hidden' classes are applied

### Cards Not Responsive
- Check breakpoints (sm/lg)
- Verify grid-cols-1/sm:grid-cols-2/lg:grid-cols-3
- Test on mobile device

### Button Not Loading
- Verify `loading` prop is passed
- Check `onCheckIn`/`onCheckOut` handlers
- Verify API endpoint returns proper response

---

## Browser DevTools

### Check Responsive Breakpoints
```
Mobile: Toggle device toolbar (Ctrl+Shift+M)
Tablet: Set width 768px
Desktop: Set width 1280px
```

### Check Console for Errors
```javascript
// Test API call
fetch('/api/attendance/check-in', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

---

## Related Files
- Components: `frontend/src/components/employee/`
- Pages: `frontend/src/app/employee/`
- Routes: `frontend/src/constants/routes.ts`
- Types: `frontend/src/types/components.ts`
- Full Docs: `EMPLOYEE_DASHBOARD_IMPLEMENTATION.md`

---

**Last Updated**: May 4, 2026  
**Version**: 1.0  
**Status**: Production Ready
