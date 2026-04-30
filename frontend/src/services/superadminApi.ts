/**
 * Super Admin API Service
 * Typed API calls for super admin functionality
 */

import { API_ENDPOINTS, API_BASE_URL } from '@/constants/endpoints';
import {
  ApiResponse,
  DashboardData,
  User,
  CreateUserRequest,
  Manager,
  HRUser,
  AttendanceStats,
  ListResponse,
  UpdateUserRequest,
} from '@/types/superadmin';

// Helper function for API calls
async function apiCall<T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error: data.error || `Request failed with status ${response.status}`,
      };
    }

    return {
      ok: true,
      data: data.data || data,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Fetch dashboard statistics
 */
export async function fetchDashboard(): Promise<ApiResponse<DashboardData>> {
  return apiCall('GET', API_ENDPOINTS.SUPERADMIN.DASHBOARD);
}

/**
 * Fetch all users with optional filtering and searching
 */
export async function fetchUsers(params?: {
  role?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<any>> {
  const query = new URLSearchParams();
  if (params?.role) query.append('role', params.role);
  if (params?.search) query.append('search', params.search);
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.offset) query.append('offset', params.offset.toString());

  const endpoint = `${API_ENDPOINTS.SUPERADMIN.USERS}${query.toString() ? '?' + query : ''}`;
  return apiCall('GET', endpoint);
}

/**
 * Fetch users by role
 */
export async function fetchUsersByRole(
  role: string,
  limit: number = 10,
  offset: number = 0
): Promise<ApiResponse<any>> {
  return fetchUsers({ role, limit, offset });
}

/**
 * Fetch single user by ID
 */
export async function fetchUser(id: number): Promise<ApiResponse<User>> {
  return apiCall('GET', API_ENDPOINTS.SUPERADMIN.GET_USER(id));
}

/**
 * Create manager
 */
export async function createManager(
  data: CreateUserRequest
): Promise<ApiResponse<Manager>> {
  return apiCall('POST', API_ENDPOINTS.SUPERADMIN.CREATE_MANAGER, data);
}

/**
 * Create HR user
 */
export async function createHR(data: CreateUserRequest): Promise<ApiResponse<HRUser>> {
  return apiCall('POST', API_ENDPOINTS.SUPERADMIN.CREATE_HR, data);
}

/**
 * Create employee
 */
export async function createEmployee(
  data: CreateUserRequest
): Promise<ApiResponse<User>> {
  return apiCall('POST', API_ENDPOINTS.SUPERADMIN.CREATE_EMPLOYEE, data);
}

/**
 * Create generic user (manager | hr | employee)
 */
export async function createUser(
  data: CreateUserRequest & { role: string }
): Promise<ApiResponse<User>> {
  return apiCall('POST', API_ENDPOINTS.SUPERADMIN.CREATE_USER, data);
}

/**
 * Update user
 */
export async function updateUser(
  id: number,
  data: UpdateUserRequest
): Promise<ApiResponse<User>> {
  return apiCall('PUT', API_ENDPOINTS.SUPERADMIN.UPDATE_USER(id), data);
}

/**
 * Update user role
 */
export async function updateUserRole(
  id: number,
  data: { role: string }
): Promise<ApiResponse<User>> {
  return apiCall('PUT', API_ENDPOINTS.SUPERADMIN.UPDATE_USER(id), data);
}

/**
 * Delete user
 */
export async function deleteUser(id: number): Promise<ApiResponse<void>> {
  return apiCall('DELETE', API_ENDPOINTS.SUPERADMIN.DELETE_USER(id));
}

/**
 * Verify password strength
 */
export async function verifyPassword(password: string): Promise<
  ApiResponse<{
    isValid: boolean;
    errors: string[];
  }>
> {
  return apiCall('POST', API_ENDPOINTS.SUPERADMIN.VERIFY_PASSWORD, { password });
}

/**
 * Fetch managers
 */
export async function fetchManagers(
  limit: number = 10,
  offset: number = 0,
  search?: string
): Promise<ApiResponse<any>> {
  const query = new URLSearchParams();
  if (search) query.append('search', search);
  if (limit) query.append('limit', limit.toString());
  if (offset) query.append('offset', offset.toString());

  const endpoint = `${API_ENDPOINTS.SUPERADMIN.MANAGERS}${query.toString() ? '?' + query : ''}`;
  return apiCall('GET', endpoint);
}

/**
 * Update manager
 */
export async function updateManager(
  id: number,
  data: { name?: string; email?: string }
): Promise<ApiResponse<User>> {
  return apiCall('PUT', API_ENDPOINTS.SUPERADMIN.UPDATE_MANAGER(id), data);
}

/**
 * Fetch HR users
 */
export async function fetchHR(
  limit: number = 10,
  offset: number = 0,
  search?: string
): Promise<ApiResponse<any>> {
  const query = new URLSearchParams();
  if (search) query.append('search', search);
  if (limit) query.append('limit', limit.toString());
  if (offset) query.append('offset', offset.toString());

  const endpoint = `${API_ENDPOINTS.SUPERADMIN.HR}${query.toString() ? '?' + query : ''}`;
  return apiCall('GET', endpoint);
}

/**
 * Update HR user
 */
export async function updateHR(
  id: number,
  data: { name?: string; email?: string }
): Promise<ApiResponse<User>> {
  return apiCall('PUT', API_ENDPOINTS.SUPERADMIN.UPDATE_HR(id), data);
}

/**
 * Fetch HR users
 */
export async function fetchHRUsers(
  limit: number = 10,
  offset: number = 0
): Promise<ApiResponse<any>> {
  return fetchUsersByRole('hr', limit, offset);
}

/**
 * Fetch employees
 */
export async function fetchEmployees(
  limit: number = 10,
  offset: number = 0
): Promise<ApiResponse<any>> {
  return fetchUsersByRole('employee', limit, offset);
}

/**
 * Fetch today's attendance (for future)
 */
export async function fetchTodayAttendance(): Promise<ApiResponse<AttendanceStats>> {
  return apiCall('GET', API_ENDPOINTS.ATTENDANCE.TODAY);
}

/**
 * Fetch daily report
 */
export async function fetchDailyReport(date?: string): Promise<ApiResponse<any>> {
  const q = date ? `?date=${encodeURIComponent(date)}` : '';
  return apiCall('GET', `${API_ENDPOINTS.REPORTS.DAILY}${q}`);
}

/**
 * Fetch monthly report
 */
export async function fetchMonthlyReport(year?: number, month?: number): Promise<ApiResponse<any>> {
  const q = year && month ? `?year=${year}&month=${month}` : '';
  return apiCall('GET', `${API_ENDPOINTS.REPORTS.MONTHLY}${q}`);
}

/**
 * Fetch employee report
 */
export async function fetchEmployeeReport(id: number, limit = 100, offset = 0): Promise<ApiResponse<any>> {
  const endpoint = `${API_ENDPOINTS.REPORTS.EMPLOYEE(id)}?limit=${limit}&offset=${offset}`;
  return apiCall('GET', endpoint);
}

/**
 * Search users
 */
export async function searchUsers(query: string): Promise<ApiResponse<any>> {
  const endpoint = `${API_ENDPOINTS.SUPERADMIN.USERS}?search=${encodeURIComponent(query)}`;
  return apiCall('GET', endpoint);
}

/**
 * Delete manager (uses shared delete user endpoint)
 */
export async function deleteManager(id: number): Promise<ApiResponse<void>> {
  return apiCall('DELETE', API_ENDPOINTS.SUPERADMIN.DELETE_USER(id));
}
