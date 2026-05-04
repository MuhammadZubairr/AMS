/**
 * Centralized role constants
 */

export const ROLES = {
  SUPERADMIN: 'superadmin',
  MANAGER: 'manager',
  HR: 'hr',
  EMPLOYEE: 'employee',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
