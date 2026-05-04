/**
 * Application Routes Configuration
 * Centralized route definitions to avoid hard-coded paths
 * Ensures DRY principle and single source of truth for all route paths
 */

export const ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
  },

  // Dashboard
  DASHBOARD: '/dashboard',

  // Employee Pages
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: (id: string | number) => `/employees/${id}`,

  // Attendance
  ATTENDANCE: '/attendance',

  // Reports
  REPORTS: '/reports',

  // Super Admin
  SUPERADMIN: {
    HOME: '/superadmin',
    DASHBOARD: '/superadmin/dashboard',
    USERS: '/superadmin/users',
    USER_CREATE: '/superadmin/create-user',
    USER_DETAIL: (id: string | number) => `/superadmin/users/${id}`,
    MANAGERS: '/superadmin/managers',
    MANAGER_CREATE: '/superadmin/create-manager',
    HR: '/superadmin/hr',
    HR_CREATE: '/superadmin/create-hr',
    ATTENDANCE: '/superadmin/attendance',
    REPORTS: '/superadmin/reports',
    PROFILE: '/superadmin/profile',
    SETTINGS: '/superadmin/settings',
  },

  // Manager Pages
  MANAGER: {
    HOME: '/manager',
    DASHBOARD: '/manager/dashboard',
    REPORTS: '/manager/reports',
    ATTENDANCE: '/manager/attendance',
    EMPLOYEES: '/manager/employees',
  },

  // HR Pages
  HR: {
    HOME: '/hr',
    DASHBOARD: '/hr/dashboard',
    EMPLOYEES: '/hr/employees',
    LEAVES: '/hr/leaves',
    ATTENDANCE: '/hr/attendance',
    REPORTS: '/hr/reports',
  },

  // Employee Pages
  EMPLOYEE: {
    HOME: '/employee',
    DASHBOARD: '/employee/dashboard',
    ATTENDANCE: '/employee/attendance',
    MY_ATTENDANCE: '/employee/my-attendance',
    ATTENDANCE_HISTORY: '/employee/attendance-history',
    LEAVE_REQUESTS: '/employee/leave-requests',
    PROFILE: '/employee/profile',
  },
} as const;
