export type AttendanceRecord = {
  employee_name: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  working_hours: string;
};
/**
 * Super Admin Types & Interfaces
 * All TypeScript types for super admin functionality
 */

// User Role Types
export type UserRole = 'superadmin' | 'manager' | 'hr' | 'employee';

// User Interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_by?: number;
  created_at: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalUsers: number;
  breakdown: {
    superadmins: number;
    managers: number;
    hr: number;
    employees: number;
  };
}

// Attendance Stats
export interface AttendanceStats {
  todayCount: number;
  absentCount: number;
}

// Combined Dashboard Data
export interface DashboardData {
  totalUsers: number;
  breakdown: {
    superadmins: number;
    managers: number;
    hr: number;
    employees: number;
  };
  attendance: {
    todayCount: number;
    absentCount: number;
  };
}

// Create User Request
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

// Update User Request
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
}

// API Response Types
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ListResponse<T> {
  ok: boolean;
  data: {
    items?: T[];
    users?: T[];
    count: number;
  };
  error?: string;
}

// Manager Type (extends User)
export type Manager = User & { role: 'manager' };

// HR Type (extends User)
export type HRUser = User & { role: 'hr' };

// Employee Type (extends User)
export type Employee = User & { role: 'employee' };

// Pagination
export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

// Filter Options
export interface FilterOptions {
  role?: UserRole;
  search?: string;
  limit?: number;
  offset?: number;
}

// Sidebar Menu Item
export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  children?: SidebarMenuItem[];
}

// Stat Card Props
export interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

// Table Column Type
export interface TableColumn<T> {
  header: string;
  key: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

// Modal Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Form State
export interface FormState {
  isLoading: boolean;
  error?: string;
  success?: string;
}

// Notification
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
