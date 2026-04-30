export const SUPERADMIN_ATTENDANCE = '/api/superadmin/today-attendance';
/**
 * API Endpoints Configuration
 * Centralized endpoint definitions
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
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
    TODAY: '/api/attendance/today',
    HISTORY: '/api/attendance/history',
    MARK: '/api/attendance/mark',
  },

  // Reports (for future)
  REPORTS: {
    DAILY: '/api/reports/daily',
    MONTHLY: '/api/reports/monthly',
    EMPLOYEE: (id: number) => `/api/reports/employee/${id}`,
  },
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
