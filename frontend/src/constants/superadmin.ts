/**
 * Super Admin UI Constants
 * Colors, messages, status options, etc.
 */

export const ROLE_OPTIONS = {
  superadmin: 'Super Admin',
  manager: 'Manager',
  hr: 'HR',
  employee: 'Employee',
} as const;

export const ROLE_COLORS = {
  superadmin: 'red',
  manager: 'blue',
  hr: 'purple',
  employee: 'green',
} as const;

export const ROLE_BADGES = {
  superadmin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  hr: 'bg-purple-100 text-purple-800',
  employee: 'bg-green-100 text-green-800',
} as const;

export const SIDEBAR_MENU = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/superadmin',
  },
  {
    id: 'managers',
    label: 'Managers',
    icon: 'Users',
    href: '/superadmin/managers',
  },
  {
    id: 'hr',
    label: 'HR',
    icon: 'Briefcase',
    href: '/superadmin/hr',
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'Users2',
    href: '/superadmin/users',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: 'Calendar',
    href: '/superadmin/attendance',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'FileText',
    href: '/superadmin/reports',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    href: '/superadmin/settings',
  },
] as const;

export const STAT_CARD_COLORS = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    value: 'text-blue-900',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    value: 'text-green-900',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    value: 'text-red-900',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    value: 'text-purple-900',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    value: 'text-yellow-900',
  },
} as const;

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
};

export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch data. Please try again.',
  CREATE_FAILED: 'Failed to create. Please try again.',
  UPDATE_FAILED: 'Failed to update. Please try again.',
  DELETE_FAILED: 'Failed to delete. Please try again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password does not meet requirements.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
} as const;

export const TABLE_PAGINATION_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGINATION_LIMIT = 10;

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  PENDING: 'pending',
} as const;

export const ATTENDANCE_STATUS_COLORS = {
  present: 'green',
  absent: 'red',
  late: 'yellow',
  pending: 'gray',
} as const;

export const DATE_FORMAT = 'MMM DD, YYYY';
export const TIME_FORMAT = 'HH:mm:ss';
export const DATETIME_FORMAT = 'MMM DD, YYYY HH:mm:ss';
