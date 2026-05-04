import { request } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/endpoints';

export type AttendanceTodayResponse = {
  checked_in?: boolean;
  checked_out?: boolean;
  mode?: 'OFFICE' | 'REMOTE' | string;
  status?: 'present' | 'late' | 'absent' | string;
  check_in?: string | null;
  check_out?: string | null;
  device_name?: string | null;
};

export type AttendanceSummaryResponse = {
  summary?: {
    total_days: number;
    present_days: number;
    late_days: number;
    absent_days: number;
    average_working_seconds: number;
  };
  history?: Array<{
    id: number | string;
    date: string;
    check_in?: string | null;
    check_out?: string | null;
    working_hours?: string | null;
    work_type?: string | null;
    status?: string | null;
  }>;
  total_records?: number;
};

export async function getAttendanceToday() {
  return request<{ ok: boolean; data: AttendanceTodayResponse }>({
    url: API_ENDPOINTS.ATTENDANCE.TODAY,
    method: 'get',
  });
}

export async function getAttendanceSummary() {
  return request<{ ok: boolean; data: AttendanceSummaryResponse }>({
    url: API_ENDPOINTS.ATTENDANCE.SUMMARY ?? '/api/attendance/summary',
    method: 'get',
  });
}
