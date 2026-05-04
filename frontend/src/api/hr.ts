import { request } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { Employee, LeaveRequest, HRDashboard, AttendanceRecord } from '@/types/hr';
import type { ApiResponse } from '@/types/api';

type PendingLeavesResponse = {
  leaves: Array<
    LeaveRequest & {
      name?: string;
      email?: string;
    }
  >;
  count: number;
};

export async function getDashboard(): Promise<HRDashboard> {
  return request<HRDashboard>({ url: API_ENDPOINTS.HR.DASHBOARD, method: 'get' });
}

export async function getEmployees(): Promise<Employee[]> {
  return request<Employee[]>({ url: API_ENDPOINTS.HR.EMPLOYEES, method: 'get' });
}

export async function getEmployee(id: number): Promise<Employee> {
  return request<Employee>({ url: API_ENDPOINTS.HR.EMPLOYEE(id), method: 'get' });
}

export async function createEmployee(payload: Partial<Employee>): Promise<Employee> {
  return request<Employee>({ url: API_ENDPOINTS.HR.EMPLOYEES, method: 'post', data: payload });
}

export async function updateEmployee(id: number, payload: Partial<Employee>): Promise<Employee> {
  return request<Employee>({ url: API_ENDPOINTS.HR.EMPLOYEE(id), method: 'put', data: payload });
}

export async function deleteEmployee(id: number): Promise<ApiResponse<void>> {
  return request<ApiResponse<void>>({ url: API_ENDPOINTS.HR.EMPLOYEE(id), method: 'delete' });
}

export async function getPendingLeaves(): Promise<{ ok: boolean; data: PendingLeavesResponse }> {
  return request<{ ok: boolean; data: PendingLeavesResponse }>({ url: API_ENDPOINTS.HR.LEAVES_PENDING, method: 'get' });
}

export async function approveLeave(id: number): Promise<ApiResponse<void>> {
  return request<ApiResponse<void>>({ url: API_ENDPOINTS.HR.LEAVE_APPROVE(id), method: 'post' });
}

export async function rejectLeave(id: number): Promise<ApiResponse<void>> {
  return request<ApiResponse<void>>({ url: API_ENDPOINTS.HR.LEAVE_REJECT(id), method: 'post' });
}

export async function getAttendanceRecent(): Promise<AttendanceRecord[]> {
  return request<AttendanceRecord[]>({ url: API_ENDPOINTS.HR.ATTENDANCE_RECENT, method: 'get' });
}

export async function getAttendanceByPeriod(period: 'today' | 'weekly' | 'monthly') {
  return request<{ attendance: AttendanceRecord[]; total: number }>({
    url: `/api/hr/attendance?period=${period}`,
    method: 'get',
  });
}

export async function getReportsDaily(date?: string): Promise<any> {
  const suffix = date ? `?date=${encodeURIComponent(date)}` : '';
  return request<any>({ url: `${API_ENDPOINTS.HR.REPORTS_DAILY}${suffix}`, method: 'get' });
}

export async function getReportsMonthly(year?: string, month?: string): Promise<any> {
  const suffix = year && month ? `?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}` : '';
  return request<any>({ url: `${API_ENDPOINTS.HR.REPORTS_MONTHLY}${suffix}`, method: 'get' });
}

export async function getReportByEmployee(id: number): Promise<any> {
  return request<any>({ url: API_ENDPOINTS.HR.REPORTS_EMPLOYEE(id), method: 'get' });
}
