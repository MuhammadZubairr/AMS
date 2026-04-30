import { request } from './api';

export const managerApi = {
  // Dashboard
  getDashboard: () => request('/api/manager/dashboard'),

  // Team management
  getTeam: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/manager/team${query ? '?' + query : ''}`);
  },

  // Team attendance
  getTeamAttendance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/manager/team-attendance${query ? '?' + query : ''}`);
  },

  // Leave requests
  getLeaveRequests: () => request('/api/manager/leave-requests'),

  // Approve/reject leaves
  approveLeave: (leaveId) => request(`/api/manager/leaves/${leaveId}/approve`, {
    method: 'POST',
  }),

  rejectLeave: (leaveId) => request(`/api/manager/leaves/${leaveId}/reject`, {
    method: 'POST',
  }),

  // Reports
  getReports: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/manager/reports${query ? '?' + query : ''}`);
  },
};