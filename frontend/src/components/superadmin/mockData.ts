import {
  ActivityLogRecord,
  AttendanceMonitoringRecord,
  AttendanceOverviewMetric,
  DepartmentRecord,
  ManagedUser,
  OfficeLocationRecord,
  ProfileSettings,
  RecentActivity,
  ReportSeriesPoint,
  SystemSettings,
} from '@/types/superadmin';

export const dashboardMetrics = [
  { title: 'Total Users', value: 284, icon: 'users', tone: 'blue', change: '+12% this month' },
  { title: 'Managers', value: 18, icon: 'manager', tone: 'purple', change: '+2 newly added' },
  { title: 'HR Users', value: 14, icon: 'hr', tone: 'green', change: '+1 this week' },
  { title: 'Employees', value: 252, icon: 'employee', tone: 'red', change: '+31 active today' },
] as const;

export const attendanceOverview: AttendanceOverviewMetric[] = [
  { title: 'Present Today', value: 214, color: '#2563EB' },
  { title: 'Absent Today', value: 18, color: '#EF4444' },
  { title: 'Work From Home', value: 64, color: '#8B5CF6' },
  { title: 'Work From Office', value: 150, color: '#10B981' },
];

export const recentActivities: RecentActivity[] = [
  { user: 'Ayesha Khan', action: 'HR created employee', role: 'HR', date: '2026-05-01 08:45 AM' },
  { user: 'Hamza Ali', action: 'Manager updated attendance', role: 'Manager', date: '2026-05-01 09:20 AM' },
  { user: 'DevFlx Admin', action: 'Superadmin added office', role: 'Super Admin', date: '2026-05-01 10:05 AM' },
  { user: 'Sara Malik', action: 'Employee reset password', role: 'Employee', date: '2026-05-01 10:40 AM' },
];

export const managedUsers: ManagedUser[] = [
  { id: 1, name: 'Ayesha Khan', email: 'ayesha@devflx.com', role: 'hr', department: 'Human Resources', phone: '+92 300 1111111', status: 'active', created_at: '2026-04-29T09:00:00Z', createdByLabel: 'Super Admin' },
  { id: 2, name: 'Hamza Ali', email: 'hamza@devflx.com', role: 'manager', department: 'Engineering', phone: '+92 300 2222222', status: 'active', created_at: '2026-04-29T09:30:00Z', createdByLabel: 'Super Admin' },
  { id: 3, name: 'Sara Malik', email: 'sara@devflx.com', role: 'employee', department: 'Marketing', phone: '+92 300 3333333', status: 'active', created_at: '2026-04-30T10:15:00Z', createdByLabel: 'Ayesha Khan' },
  { id: 4, name: 'Usman Javed', email: 'usman@devflx.com', role: 'employee', department: 'Operations', phone: '+92 300 4444444', status: 'suspended', created_at: '2026-04-30T11:25:00Z', createdByLabel: 'Hamza Ali' },
  { id: 5, name: 'Nadia Noor', email: 'nadia@devflx.com', role: 'manager', department: 'Sales', phone: '+92 300 5555555', status: 'active', created_at: '2026-04-30T12:05:00Z', createdByLabel: 'Super Admin' },
  { id: 6, name: 'Bilal Shah', email: 'bilal@devflx.com', role: 'hr', department: 'Human Resources', phone: '+92 300 6666666', status: 'active', created_at: '2026-04-30T12:45:00Z', createdByLabel: 'Super Admin' },
];

export const departments: DepartmentRecord[] = [
  { id: 1, name: 'Engineering', totalEmployees: 82, createdAt: '2026-04-01' },
  { id: 2, name: 'Human Resources', totalEmployees: 14, createdAt: '2026-04-02' },
  { id: 3, name: 'Marketing', totalEmployees: 36, createdAt: '2026-04-05' },
  { id: 4, name: 'Sales', totalEmployees: 48, createdAt: '2026-04-08' },
  { id: 5, name: 'Operations', totalEmployees: 32, createdAt: '2026-04-10' },
];

export const officeLocations: OfficeLocationRecord[] = [
  { id: 1, officeName: 'DevFlx HQ', latitude: '24.8607', longitude: '67.0011', radius: 250 },
  { id: 2, officeName: 'Karachi Satellite Office', latitude: '24.9000', longitude: '67.1200', radius: 180 },
];

export const attendanceRecords: AttendanceMonitoringRecord[] = [
  { id: 1, employeeName: 'Sara Malik', department: 'Marketing', date: '2026-05-01', checkIn: '09:01 AM', checkOut: '06:06 PM', workType: 'Work From Office', gpsVerified: true },
  { id: 2, employeeName: 'Usman Javed', department: 'Operations', date: '2026-05-01', checkIn: '09:14 AM', checkOut: '06:10 PM', workType: 'Work From Office', gpsVerified: true },
  { id: 3, employeeName: 'Nadia Noor', department: 'Sales', date: '2026-05-01', checkIn: '09:18 AM', checkOut: '05:59 PM', workType: 'Work From Home', gpsVerified: false },
  { id: 4, employeeName: 'Ayesha Khan', department: 'Human Resources', date: '2026-05-01', checkIn: '08:58 AM', checkOut: '06:03 PM', workType: 'Work From Office', gpsVerified: true },
  { id: 5, employeeName: 'Hamza Ali', department: 'Engineering', date: '2026-05-01', checkIn: '09:06 AM', checkOut: '06:11 PM', workType: 'Work From Home', gpsVerified: false },
];

export const activityLogs: ActivityLogRecord[] = [
  { id: 1, user: 'Ayesha Khan', action: 'Created employee account', module: 'User Management', date: '2026-05-01 08:45 AM', ipAddress: '10.0.2.14' },
  { id: 2, user: 'Hamza Ali', action: 'Updated attendance record', module: 'Attendance', date: '2026-05-01 09:20 AM', ipAddress: '10.0.2.20' },
  { id: 3, user: 'DevFlx Admin', action: 'Added office location', module: 'Office Locations', date: '2026-05-01 10:05 AM', ipAddress: '10.0.2.1' },
  { id: 4, user: 'Sara Malik', action: 'Changed password', module: 'Profile', date: '2026-05-01 10:40 AM', ipAddress: '10.0.2.33' },
];

export const monthlyAttendance: ReportSeriesPoint[] = [
  { label: 'Jan', value: 78 },
  { label: 'Feb', value: 81 },
  { label: 'Mar', value: 84 },
  { label: 'Apr', value: 88 },
  { label: 'May', value: 91 },
];

export const departmentComparison: ReportSeriesPoint[] = [
  { label: 'Engineering', value: 82 },
  { label: 'HR', value: 14 },
  { label: 'Marketing', value: 36 },
  { label: 'Sales', value: 48 },
  { label: 'Operations', value: 32 },
];

export const wfhVsWfo: ReportSeriesPoint[] = [
  { label: 'WFH', value: 64 },
  { label: 'WFO', value: 150 },
];

export const systemSettings: SystemSettings = {
  companyName: 'DevFlx',
  officeAddress: 'North Avenue, Karachi, Pakistan',
  defaultOfficeRadius: 250,
  workStartTime: '09:00',
  workEndTime: '18:00',
};

export const profileSettings: ProfileSettings = {
  name: 'Saqib Mustafa',
  email: 'saqib.mustafa@devflx.com',
  avatarUrl: '',
};