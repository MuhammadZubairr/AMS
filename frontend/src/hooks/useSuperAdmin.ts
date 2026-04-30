import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_ATTENDANCE } from '@/constants/endpoints';
import { AttendanceRecord } from '@/types/superadmin';

async function fetchAttendance(period: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}${SUPERADMIN_ATTENDANCE}?period=${period}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch attendance');
  const json = await res.json();
  return json.data.attendance as AttendanceRecord[];
}

export function useAttendance(period: string) {
  return useQuery(['superadmin', 'attendance', period], () => fetchAttendance(period));
}
/**
 * Super Admin React Query Hooks
 * All data fetching and mutations for super admin
 */

import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import * as superadminApi from '@/services/superadminApi';
import {
  DashboardData,
  User,
  CreateUserRequest,
  Manager,
  HRUser,
  UpdateUserRequest,
} from '@/types/superadmin';

// Query Keys
export const superadminKeys = {
  all: ['superadmin'] as const,
  dashboard: () => [...superadminKeys.all, 'dashboard'] as const,
  users: () => [...superadminKeys.all, 'users'] as const,
  usersByRole: (role: string) => [...superadminKeys.users(), role] as const,
  userDetail: (id: number) => [...superadminKeys.all, 'user', id] as const,
  managers: () => [...superadminKeys.all, 'managers'] as const,
  hrUsers: () => [...superadminKeys.all, 'hr'] as const,
  employees: () => [...superadminKeys.all, 'employees'] as const,
  attendance: () => [...superadminKeys.all, 'attendance'] as const,
} as const;

/**
 * Fetch dashboard data
 */
export function useDashboard() {
  return useQuery({
    queryKey: superadminKeys.dashboard(),
    queryFn: async () => {
      const response = await superadminApi.fetchDashboard();
      if (!response.ok) throw new Error(response.error);
      return response.data as DashboardData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch all users
 */
export function useUsers(limit: number = 10, offset: number = 0) {
  return useQuery({
    queryKey: [...superadminKeys.users(), limit, offset],
    queryFn: async () => {
      const response = await superadminApi.fetchUsers({ limit, offset });
      if (!response.ok) throw new Error(response.error);
      return response.data;
    },
  });
}

/**
 * Fetch users by role
 */
export function useUsersByRole(role: string, limit: number = 10, offset: number = 0) {
  return useQuery({
    queryKey: [...superadminKeys.usersByRole(role), limit, offset],
    queryFn: async () => {
      const response = await superadminApi.fetchUsersByRole(role, limit, offset);
      if (!response.ok) throw new Error(response.error);
      return response.data;
    },
    enabled: !!role,
  });
}

/**
 * Fetch single user
 */
export function useUser(id: number | null) {
  return useQuery({
    queryKey: superadminKeys.userDetail(id || 0),
    queryFn: async () => {
      if (!id) throw new Error('User ID required');
      const response = await superadminApi.fetchUser(id);
      if (!response.ok) throw new Error(response.error);
      return response.data as User;
    },
    enabled: !!id,
  });
}

/**
 * Fetch managers
 */
export function useManagers(limit: number = 10, offset: number = 0) {
  return useQuery({
    queryKey: [...superadminKeys.managers(), limit, offset],
    queryFn: async () => {
      const response = await superadminApi.fetchManagers(limit, offset);
      if (!response.ok) throw new Error(response.error);
      return response.data;
    },
  });
}

/**
 * Fetch HR users
 */
export function useHRUsers(limit: number = 10, offset: number = 0) {
  return useQuery({
    queryKey: [...superadminKeys.hrUsers(), limit, offset],
    queryFn: async () => {
      const response = await superadminApi.fetchHRUsers(limit, offset);
      if (!response.ok) throw new Error(response.error);
      return response.data;
    },
  });
}

/**
 * Fetch employees
 */
export function useEmployees(limit: number = 10, offset: number = 0) {
  return useQuery({
    queryKey: [...superadminKeys.employees(), limit, offset],
    queryFn: async () => {
      const response = await superadminApi.fetchEmployees(limit, offset);
      if (!response.ok) throw new Error(response.error);
      return response.data;
    },
  });
}

/**
 * Fetch daily report
 */
export function useDailyReport(date?: string) {
  return useQuery({
    queryKey: [...superadminKeys.all, 'report', 'daily', date || 'today'],
    queryFn: async () => {
      const response = await superadminApi.fetchDailyReport(date);
      if (!response.ok) throw new Error(response.error);
      return response.data;
    },
  });
}

/**
 * Fetch monthly report
 */
export function useMonthlyReport(year?: number, month?: number) {
  return useQuery({
    queryKey: [...superadminKeys.all, 'report', 'monthly', year || 'current', month || 'current'],
    queryFn: async () => {
      const response = await superadminApi.fetchMonthlyReport(year, month);
      if (!response.ok) throw new Error(response.error);
      return response.data;
    },
  });
}

/**
 * Fetch employee report
 */
export function useEmployeeReport(id: number | null, limit = 100, offset = 0) {
  return useQuery({
    queryKey: [...superadminKeys.all, 'report', 'employee', id || 0, limit, offset],
    queryFn: async () => {
      if (!id) throw new Error('Employee id required');
      const response = await superadminApi.fetchEmployeeReport(id, limit, offset);
      if (!response.ok) throw new Error(response.error);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create manager mutation
 */
export function useCreateManager(queryClient: QueryClient) {
  return useMutation({
    mutationFn: (data: CreateUserRequest) => superadminApi.createManager(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superadminKeys.managers() });
      queryClient.invalidateQueries({ queryKey: superadminKeys.dashboard() });
    },
  });
}

/**
 * Create HR mutation
 */
export function useCreateHR(queryClient: QueryClient) {
  return useMutation({
    mutationFn: (data: CreateUserRequest) => superadminApi.createHR(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superadminKeys.hrUsers() });
      queryClient.invalidateQueries({ queryKey: superadminKeys.dashboard() });
    },
  });
}

/**
 * Create employee mutation
 */
export function useCreateEmployee(queryClient: QueryClient) {
  return useMutation({
    mutationFn: (data: CreateUserRequest) => superadminApi.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superadminKeys.employees() });
      queryClient.invalidateQueries({ queryKey: superadminKeys.dashboard() });
    },
  });
}

/**
 * Create generic user mutation
 */
export function useCreateUser(queryClient: QueryClient) {
  return useMutation({
    mutationFn: (data: CreateUserRequest & { role: string }) => superadminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superadminKeys.users() });
      queryClient.invalidateQueries({ queryKey: superadminKeys.dashboard() });
    },
  });
}

/**
 * Update user mutation
 */
export function useUpdateUser(queryClient: QueryClient) {
  return useMutation({
    mutationFn: (data: { id: number; updates: UpdateUserRequest }) =>
      superadminApi.updateUser(data.id, data.updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: superadminKeys.userDetail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: superadminKeys.users() });
      queryClient.invalidateQueries({ queryKey: superadminKeys.dashboard() });
    },
  });
}

/**
 * Delete user mutation
 */
export function useDeleteUser(queryClient: QueryClient) {
  return useMutation({
    mutationFn: (id: number) => superadminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superadminKeys.users() });
      queryClient.invalidateQueries({ queryKey: superadminKeys.dashboard() });
    },
  });
}

/**
 * Verify password mutation
 */
export function useVerifyPassword() {
  return useMutation({
    mutationFn: (password: string) => superadminApi.verifyPassword(password),
  });
}
