# My Attendance Page - Quick Reference

## Quick Start

### Access the Page
```
http://localhost:3000/employee/my-attendance
```

### Import Components
```typescript
import {
  AttendanceSummaryCardDetail,
  AttendanceTimeline,
  WorkingHoursProgress,
} from '@/components/employee';
```

---

## Component Examples

### AttendanceSummaryCardDetail

```typescript
<AttendanceSummaryCardDetail
  label="Check In"
  value="09:00 AM"
  icon="✓"
  badge="On time"
/>
```

**Props**:
- `label`: Card title
- `value`: Main value
- `icon`: Icon/emoji (optional)
- `badge`: Status badge (optional)

**Supported Values**:
- Check In: "09:00 AM"
- Check Out: "—" or "06:00 PM"
- Work Type: "Office" or "Home"
- Status: "Active", "Inactive", "Pending"

---

### WorkingHoursProgress

```typescript
<WorkingHoursProgress
  requiredHours={8}
  completedHours={4.5}
  remainingHours={3.5}
  percentage={56}
/>
```

**Props**:
- `requiredHours`: Daily target (default: 8)
- `completedHours`: Hours worked so far
- `remainingHours`: Hours left to complete
- `percentage`: Progress 0-100

**Time Formatting**: Automatically converts to "Xh Ym" format

---

### AttendanceTimeline

```typescript
const events = [
  {
    id: '1',
    time: '09:00 AM',
    title: 'Checked In',
    description: 'Office - WFO',
    type: 'checkin',
  },
  {
    id: '2',
    time: '12:30 PM',
    title: 'Break Started',
    type: 'breakstart',
  },
  {
    id: '3',
    time: '01:15 PM',
    title: 'Break Ended',
    type: 'breakend',
  },
  {
    id: '4',
    time: 'Pending',
    title: 'Check Out',
    type: 'pending',
  },
];

<AttendanceTimeline events={events} />
```

**Event Types**:
- `'checkin'` - Green circle
- `'breakstart'` - Orange circle
- `'breakend'` - Yellow circle
- `'checkout'` - Blue circle
- `'pending'` - Gray circle

---

## Route Navigation

```typescript
import { ROUTES } from '@/constants/routes';

// My Attendance page
ROUTES.EMPLOYEE.MY_ATTENDANCE  // /employee/my-attendance
```

---

## Common Patterns

### Responsive Grid (Summary Cards)

```typescript
<div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
  {/* 2 columns on mobile, 4 on desktop */}
</div>
```

### Progress Bar Calculation

```typescript
const percentage = Math.round((completedHours / requiredHours) * 100);
// Or calculate from hours
const percentage = 56; // Direct value
```

### Timeline Sorting

```typescript
// Sort events by time (morning to evening)
const sortedEvents = events.sort((a, b) => {
  const timeA = parseTime(a.time);
  const timeB = parseTime(b.time);
  return timeA - timeB;
});
```

---

## Styling Guide

### Color Coding

| Element | Color | Class |
|---------|-------|-------|
| Check In | Green | bg-green-100 |
| Break | Orange | bg-orange-100 |
| Check Out | Blue | bg-blue-100 |
| Pending | Gray | bg-slate-100 |

### Responsive Breakpoints

```css
/* Mobile first */
default          /* < 640px */
sm:              /* ≥ 640px */
md:              /* ≥ 768px */
lg:              /* ≥ 1024px */
```

### Component Spacing

```css
Card padding:   p-6 (1.5rem)  sm:p-8 (2rem)
Grid gap:       gap-4         sm:gap-6
Border:         border-blue-100
Shadow:         shadow-sm
Rounded:        rounded-xl
```

---

## Data Integration

### Fetch Today's Data

```typescript
const response = await fetch('/api/attendance/today');
const data = await response.json();

// Use with WorkingHoursProgress
<WorkingHoursProgress
  completedHours={data.completedHours}
  requiredHours={data.requiredHours}
  percentage={Math.round((data.completedHours/data.requiredHours)*100)}
/>
```

### React Query Integration

```typescript
import { useQuery } from '@tanstack/react-query';

const { data: attendance, isLoading } = useQuery(
  ['attendance', 'today'],
  () => fetch('/api/attendance/today').then(r => r.json())
);

const { data: timeline } = useQuery(
  ['attendance', 'timeline'],
  () => fetch('/api/attendance/timeline').then(r => r.json())
);
```

---

## API Endpoints

| Endpoint | Method | Response |
|----------|--------|----------|
| `/api/attendance/today` | GET | Attendance data |
| `/api/attendance/timeline` | GET | Events array |
| `/api/attendance/weekly` | GET | Weekly stats |
| `/api/leaves/balance` | GET | Leave balance |

---

## Mobile Optimization

### Touch Targets
- Minimum: 56px × 56px
- All buttons meet this standard

### Card Sizes
- Mobile: Full width with padding
- Tablet: Side-by-side with gaps
- Desktop: Multi-column grid

### Text Readability
- Font sizes responsive
- Color contrast ≥ 4.5:1
- Line height adequate

---

## Troubleshooting

### Timeline not showing
```typescript
// Check: events array format
console.log(events); // Should be Array<TimelineEvent>
```

### Progress bar stuck
```typescript
// Check: percentage 0-100
console.log(percentage); // Should be 56, not 0.56
```

### Cards not wrapping
```typescript
// Check: grid classes applied
className="grid grid-cols-2 md:grid-cols-4 gap-6"
```

### Fonts not loading
```typescript
// Ensure Tailwind CSS loaded in layout.tsx
import '../styles/globals.css'
```

---

## Browser DevTools

### Check Responsive
```
Toggle device: Ctrl+Shift+M (Windows/Linux)
Toggle device: Cmd+Shift+M (Mac)
```

### Debug Grid
```javascript
// Open console
document.querySelectorAll('.grid').forEach(el => {
  el.style.border = '2px solid red';
});
```

### Profile Performance
```javascript
performance.mark('timeline-start');
// ... render timeline ...
performance.mark('timeline-end');
performance.measure('timeline', 'timeline-start', 'timeline-end');
```

---

## Component Props Reference

### AttendanceSummaryCardDetail

```typescript
{
  label: "Check In",           // Required
  value: "09:00 AM",           // Required
  icon?: "✓",                  // Optional
  badge?: "On time",           // Optional
  className?: "mt-4"           // Optional
}
```

### WorkingHoursProgress

```typescript
{
  requiredHours?: 8,           // Default: 8
  completedHours?: 4.5,        // Default: 0
  remainingHours?: 3.5,        // Auto-calculated
  percentage?: 56,             // 0-100, auto-calculated
  className?: "mt-4"           // Optional
}
```

### AttendanceTimeline

```typescript
{
  events?: [                   // Default: []
    {
      id: "1",
      time: "09:00 AM",
      title: "Checked In",
      description?: "Office",
      type: "checkin"  // checkin|breakstart|breakend|checkout|pending
    }
  ],
  loading?: false,             // Show skeleton
  className?: "mt-4"           // Optional
}
```

---

## Performance Tips

1. **Lazy Load Components**
   ```typescript
   const TimelineComponent = dynamic(() => import('./AttendanceTimeline'), {
     loading: () => <div>Loading...</div>
   });
   ```

2. **Memoize Data**
   ```typescript
   const events = useMemo(() => sortedEvents, [data]);
   ```

3. **Cache Results**
   ```typescript
   // React Query already caches by default
   ```

---

## Export Formats

### Timeline as JSON
```typescript
const json = JSON.stringify(events, null, 2);
// Save or send to clipboard
```

### Progress as CSV
```typescript
const csv = `Hours,Completed\n${requiredHours},${completedHours}`;
```

---

## Related Routes

```
/employee/dashboard        - Main dashboard
/employee/my-attendance    - This page
/employee/attendance-history - Historical view
/employee/leave-requests   - Leave management
/employee/profile          - User profile
```

---

**Last Updated**: May 4, 2026  
**Status**: Production Ready  
**Version**: 1.0
