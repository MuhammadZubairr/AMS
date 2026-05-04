export type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  joinedAt?: string;
};

export type LeaveRequest = {
  id: number;
  employeeId: number;
  user_id?: number;
  user_name?: string;
  user_email?: string;
  leave_type?: string;
  from: string;
  to: string;
  start_date?: string;
  end_date?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
};

export type AttendanceRecord = {
  id: number;
  name?: string;
  user_name?: string;
  employeeId?: number;
  user_id?: number;
  date: string;
  check_in?: string;
  check_out?: string;
  check_in_time?: string;
  check_out_time?: string | null;
  status?: string;
  mode?: 'OFFICE' | 'REMOTE' | string;
  work_type?: string;
  working_minutes?: number | null;
};

export type HRDashboard = {
  total_employees: number;
  present_today: number;
  absent_today: number;
  late_today: number;
  wfh_today?: number;
  wfo_today?: number;
  pending_leaves: number;
};
