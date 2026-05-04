/**
 * Common Component Prop Types
 * Centralized interface definitions for reusable component props
 * Ensures type safety and consistency across all components
 */

export interface CommonProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface ProvidersProps {
  children: React.ReactNode;
}

export interface NavbarProps {}

export interface SidebarProps {
  className?: string;
}

export interface LogoutProps {
  className?: string;
  onLogout?: () => void;
}

export interface AttendanceButtonProps {
  className?: string;
  onClockIn?: () => void;
  onClockOut?: () => void;
}

export interface DatabaseStatusProps {
  className?: string;
}

export interface EmployeeTableProps {
  data?: any[];
  loading?: boolean;
}

export interface ManagerLayoutProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface BrandLogoProps {
  className?: string;
  compact?: boolean;
  subtitle?: string;
  tone?: 'brand' | 'inverse';
}

// Employee Components
export interface EmployeeSidebarProps {
  className?: string;
}

export interface EmployeeNavbarProps {
  employeeName?: string;
}

export interface WelcomeCardProps {
  employeeName?: string;
  className?: string;
}

export interface AttendanceActionCardProps {
  isCheckedIn?: boolean;
  onCheckIn?: () => void | Promise<void>;
  onCheckOut?: () => void | Promise<void>;
  loading?: boolean;
  className?: string;
}

export interface TodayAttendanceCardProps {
  checkInTime?: string | null;
  checkOutTime?: string | null;
  workType?: 'office' | 'home' | null;
  status?: 'checked-in' | 'checked-out' | 'absent' | null;
  workingHours?: string | null;
  className?: string;
}

export interface AttendanceSummaryCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red';
  badge?: string;
  className?: string;
}

export interface RecentAttendanceTableProps {
  data?: Array<{
    date: string;
    checkIn: string;
    checkOut: string;
    workType: string;
    status: string;
  }>;
  loading?: boolean;
  className?: string;
}

// My Attendance Page Components

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  type: 'checkin' | 'breakstart' | 'breakend' | 'checkout' | 'pending';
}

export interface AttendanceTimelineProps {
  events?: TimelineEvent[];
  loading?: boolean;
  className?: string;
}

export interface WorkingHoursProgressProps {
  requiredHours?: number;
  completedHours?: number;
  remainingHours?: number;
  percentage?: number;
  className?: string;
}

// Attendance History Page Components
export interface AttendanceRecord {
  date: string;
  checkIn?: string;
  checkOut?: string;
  workingHours?: string;
  workType: string;
  status: string;
}

export interface AttendanceFiltersProps {
  onStatusChange?: (status: 'all' | 'present' | 'absent' | 'late') => void;
  onWorkTypeChange?: (workType: 'all' | 'office' | 'home') => void;
  onDateRangeChange?: (range: { from: string; to: string }) => void;
  className?: string;
}

export interface MonthlySummaryCardsProps {
  stats?: {
    presentDays: number;
    absentDays: number;
    lateDays: number;
    workFromHomeDays: number;
  };
  loading?: boolean;
  className?: string;
}

export interface AttendanceHistoryCardProps {
  record: AttendanceRecord;
  className?: string;
}

export interface AttendanceHistoryTableProps {
  data?: AttendanceRecord[];
  loading?: boolean;
  className?: string;
}
