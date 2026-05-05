export const SUPERADMIN_ATTENDANCE = '/api/superadmin/today-attendance';
/**
 * API Endpoints Configuration
 * Centralized endpoint definitions
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },

  // Health
  HEALTH: {
    DB: '/health/db',
  },

  // Super Admin Dashboard
  SUPERADMIN: {
    DASHBOARD: '/api/superadmin/dashboard',
    USERS: '/api/superadmin/users',
    GET_USER: (id: number) => `/api/superadmin/users/${id}`,
    CREATE_MANAGER: '/api/superadmin/create-manager',
    CREATE_HR: '/api/superadmin/create-hr',
    CREATE_EMPLOYEE: '/api/superadmin/create-employee',
    CREATE_USER: '/api/superadmin/create-user',
    UPDATE_USER: (id: number) => `/api/superadmin/users/${id}`,
    DELETE_USER: (id: number) => `/api/superadmin/users/${id}`,
    VERIFY_PASSWORD: '/api/superadmin/verify-password',
    MANAGERS: '/api/superadmin/managers',
    UPDATE_MANAGER: (id: number) => `/api/superadmin/managers/${id}`,
    HR: '/api/superadmin/hr',
    UPDATE_HR: (id: number) => `/api/superadmin/hr/${id}`,
  },

  // Attendance (for future)
  ATTENDANCE: {
    SUMMARY: '/api/attendance/summary',
    TODAY: '/api/attendance/today',
    HISTORY: '/api/attendance/history',
    MARK: '/api/attendance/mark',
  },

  // HR (Human Resources)
  HR: {
    DASHBOARD: '/api/hr/dashboard',
    EMPLOYEES: '/api/hr/employees',
    EMPLOYEE: (id: number) => `/api/hr/employees/${id}`,
    LEAVES_PENDING: '/api/hr/leaves/pending',
    LEAVE_APPROVE: (id: number) => `/api/hr/leaves/${id}/approve`,
    LEAVE_REJECT: (id: number) => `/api/hr/leaves/${id}/reject`,
    ATTENDANCE_RECENT: '/api/hr/attendance/recent',
    REPORTS_DAILY: '/api/hr/reports/daily',
    REPORTS_MONTHLY: '/api/hr/reports/monthly',
    REPORTS_EMPLOYEE: (id: number) => `/api/hr/reports/employee/${id}`,
  },

  // Reports (for future)
  REPORTS: {
    DAILY: '/api/reports/daily',
    MONTHLY: '/api/reports/monthly',
    EMPLOYEE: (id: number) => `/api/reports/employee/${id}`,
  },
} as const;

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || '';

// Use same-origin by default so Next.js rewrites can proxy requests and avoid CORS/mixed-content issues.
export const API_BASE_URL = configuredApiUrl.replace(/\/$/, '');
