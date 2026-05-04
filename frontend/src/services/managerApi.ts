import { request, ApiResponse } from './api';

/**
 * Manager API response types
 */
export interface DashboardData {
  summary: Record<string, any>;
  recentMetrics: Record<string, any>;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  attendance_status?: string;
  [key: string]: any;
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  status: string;
  [key: string]: any;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
  reason?: string;
  [key: string]: any;
}

export interface Report {
  id: string;
  title: string;
  data: any;
  [key: string]: any;
}

/**
 * Query parameters type
 */
interface QueryParams {
  [key: string]: string | number | boolean;
}

/**
 * Manager access API service
 * Provides methods for managers to access team, attendance, and leave data
 */
export const managerApi = {
  /**
   * Get manager dashboard with summary data
   * @returns {Promise<ApiResponse<DashboardData>>} Dashboard data
   */
  getDashboard: (): Promise<ApiResponse<DashboardData>> =>
    request('/api/manager/dashboard'),

  /**
   * Get team members
   * @param {QueryParams} params - Query parameters for filtering
   * @returns {Promise<ApiResponse<TeamMember[]>>} Team members list
   */
  getTeam: (params: QueryParams = {}): Promise<ApiResponse<TeamMember[]>> => {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return request(`/api/manager/team${query ? '?' + query : ''}`);
  },

  /**
   * Get team attendance records
   * @param {QueryParams} params - Query parameters for filtering
   * @returns {Promise<ApiResponse<AttendanceRecord[]>>} Attendance records
   */
  getTeamAttendance: (params: QueryParams = {}): Promise<ApiResponse<AttendanceRecord[]>> => {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return request(`/api/manager/team-attendance${query ? '?' + query : ''}`);
  },

  /**
   * Get pending leave requests for team
   * @returns {Promise<ApiResponse<LeaveRequest[]>>} Leave requests
   */
  getLeaveRequests: (): Promise<ApiResponse<LeaveRequest[]>> =>
    request('/api/manager/leave-requests'),

  /**
   * Approve a leave request
   * @param {number} leaveId - ID of the leave request
   * @returns {Promise<ApiResponse>} Approval response
   */
  approveLeave: (leaveId: number): Promise<ApiResponse> =>
    request(`/api/manager/leaves/${leaveId}/approve`, {
      method: 'POST',
    }),

  /**
   * Reject a leave request
   * @param {number} leaveId - ID of the leave request
   * @returns {Promise<ApiResponse>} Rejection response
   */
  rejectLeave: (leaveId: number): Promise<ApiResponse> =>
    request(`/api/manager/leaves/${leaveId}/reject`, {
      method: 'POST',
    }),

  /**
   * Get reports with optional filtering
   * @param {QueryParams} params - Query parameters for filtering reports
   * @returns {Promise<ApiResponse<Report[]>>} Reports list
   */
  getReports: (params: QueryParams = {}): Promise<ApiResponse<Report[]>> => {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return request(`/api/manager/reports${query ? '?' + query : ''}`);
  },
};
