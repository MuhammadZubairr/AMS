 'use client';

import { useEffect, useState } from 'react';
import { request } from '@/api/client';
import EmployeeLayout from '@/components/employee/EmployeeLayout';
import AttendanceFilters from '@/components/employee/AttendanceFilters';
import MonthlySummaryCards from '@/components/employee/MonthlySummaryCards';
import AttendanceHistoryTable from '@/components/employee/AttendanceHistoryTable';
import AttendanceHistoryCard from '@/components/employee/AttendanceHistoryCard';
import type { AttendanceRecord } from '@/types/components';

/**
 * Attendance History Page
 * Displays comprehensive attendance records with filters and summaries
 * Includes monthly statistics, filters, and responsive table/card views
 */
export default function AttendanceHistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');
  const [workTypeFilter, setWorkTypeFilter] = useState<'all' | 'office' | 'home'>('all');
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [retryKey, setRetryKey] = useState<number>(0);

  // Mock attendance data (fallback)
  const mockAttendanceData: AttendanceRecord[] = [
    {
      date: '2026-05-03',
      checkIn: '09:15 AM',
      checkOut: '06:45 PM',
      workingHours: '9h 30m',
      workType: 'Office',
      status: 'Present',
    },
    {
      date: '2026-05-02',
      checkIn: '08:50 AM',
      checkOut: '05:30 PM',
      workingHours: '8h 40m',
      workType: 'Home',
      status: 'Present',
    },
    {
      date: '2026-05-01',
      checkIn: '09:45 AM',
      checkOut: '07:15 PM',
      workingHours: '9h 30m',
      workType: 'Office',
      status: 'Late',
    },
    {
      date: '2026-04-30',
      checkIn: '—',
      checkOut: '—',
      workingHours: '—',
      workType: '—',
      status: 'Absent',
    },
    {
      date: '2026-04-29',
      checkIn: '09:00 AM',
      checkOut: '05:45 PM',
      workingHours: '8h 45m',
      workType: 'Home',
      status: 'Present',
    },
    {
      date: '2026-04-28',
      checkIn: '09:10 AM',
      checkOut: '06:00 PM',
      workingHours: '8h 50m',
      workType: 'Office',
      status: 'Present',
    },
    {
      date: '2026-04-27',
      checkIn: '09:30 AM',
      checkOut: '06:15 PM',
      workingHours: '8h 45m',
      workType: 'Office',
      status: 'Present',
    },
    {
      date: '2026-04-26',
      checkIn: '09:05 AM',
      checkOut: '05:50 PM',
      workingHours: '8h 45m',
      workType: 'Home',
      status: 'Present',
    },
  ];

  // Fetch attendance when filters, pagination, or retry change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // map frontend workType to backend mode
        const workTypeParam = workTypeFilter === 'office' ? 'OFFICE' : workTypeFilter === 'home' ? 'REMOTE' : '';
        const offset = (page - 1) * pageSize;
        const params: Record<string, any> = {};
        if (selectedMonth) params.month = selectedMonth;
        if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
        if (workTypeParam) params.workType = workTypeParam;
        if (dateRange.from) params.from = dateRange.from;
        if (dateRange.to) params.to = dateRange.to;
        params.limit = pageSize;
        params.offset = offset;

        const json = await request<{ ok: boolean; data: any }>({ url: '/api/attendance/history', method: 'get', params });

        // response shape: { ok: true, data: { history: { total, records }, stats } }
        const history = json?.data?.history;
        const stats = json?.data?.stats;
        if (history) {
          // Normalize backend fields (snake_case) to frontend camelCase expected by components
          const normalized = (history.records || []).map((r: any) => ({
            date: r.date,
            checkIn: r.check_in || r.checkIn || '—',
            checkOut: r.check_out || r.checkOut || '—',
            workingHours: r.working_hours || r.workingHours || '—',
            workType:
              r.work_type === 'OFFICE' || (r.work_type || '').toLowerCase() === 'office'
                ? 'Office'
                : r.work_type === 'REMOTE' || (r.work_type || '').toLowerCase() === 'home'
                ? 'Home'
                : r.work_type || r.mode || '—',
            status:
              typeof r.status === 'string' ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : r.status,
          }));

          setAttendanceData(normalized);
          setTotalRecords(history.total || 0);
        } else {
          setAttendanceData([]);
          setTotalRecords(0);
        }

        if (stats) {
          setMonthlyStats({
            presentDays: stats.present_days,
            absentDays: stats.absent_days,
            lateDays: stats.late_days,
            workFromHomeDays: stats.work_from_home_days || 0,
            averageWorkingSeconds: stats.average_working_seconds || 0,
          });
        } else {
          setMonthlyStats(null);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedMonth, statusFilter, workTypeFilter, dateRange, page, pageSize, retryKey]);

  // Default stats if API not available
  const fallbackStats = {
    presentDays: 18,
    absentDays: 2,
    lateDays: 1,
    workFromHomeDays: 7,
  };

  // Format month for display
  const monthDisplay = new Date(selectedMonth + '-01').toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <EmployeeLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Attendance History</h1>
          <p className="mt-1 text-slate-600">View all your past attendance records</p>
        </div>

        {/* Month Selector */}
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <label className="text-sm font-medium text-slate-700">Select Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Subheading: Month Display */}
      <p className="mb-6 text-sm font-medium text-slate-600">
        Showing attendance for <span className="text-slate-900 font-semibold">{monthDisplay}</span>
      </p>

      {/* Section 1: Filters */}
      <div className="mb-8">
        <AttendanceFilters
          onStatusChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          onWorkTypeChange={(v) => {
            setWorkTypeFilter(v);
            setPage(1);
          }}
          onDateRangeChange={(r) => {
            setDateRange(r);
            setPage(1);
          }}
        />
      </div>

      {/* Section 2: Monthly Summary Cards */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">Monthly Summary</h2>
        <MonthlySummaryCards stats={monthlyStats || fallbackStats} loading={loading} />
      </div>

      {/* Section 3: Attendance Records */}
      <div className="mb-8">
        {/* Show any fetch error with retry */}
        {error ? (
          <div className="mb-4 rounded-md border border-red-100 bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-red-700">{error}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setError(null);
                    setRetryKey((k) => k + 1);
                  }}
                  className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Desktop View: Table */}
        <AttendanceHistoryTable data={attendanceData.length ? attendanceData : mockAttendanceData} loading={loading} />

        {/* Mobile View: Cards */}
        <div className="space-y-4 sm:hidden">
          <h2 className="text-lg font-bold text-slate-900">Attendance Records</h2>
          {(attendanceData.length ? attendanceData : mockAttendanceData).map((record, idx) => (
            <AttendanceHistoryCard key={idx} record={record} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {totalRecords === 0 ? 0 : (page - 1) * pageSize + 1} - {Math.min((page - 1) * pageSize + (attendanceData.length || pageSize), totalRecords)} of {totalRecords}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Rows:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={(page - 1) * pageSize + (attendanceData.length || 0) >= totalRecords}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Summary Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* Total Working Hours */}
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-medium text-slate-600 sm:text-sm">Total Working Hours</p>
          <p className="mt-2 text-3xl font-bold text-blue-600 sm:text-4xl">{monthlyStats?.total_working_hours || '160h 30m'}</p>
          <p className="mt-2 text-xs text-slate-500">For {monthDisplay}</p>
        </div>

        {/* Average Hours Per Day */}
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-medium text-slate-600 sm:text-sm">Average Hours/Day</p>
          <p className="mt-2 text-3xl font-bold text-green-600 sm:text-4xl">8h 55m</p>
          <p className="mt-2 text-xs text-slate-500">Based on work days</p>
        </div>

        {/* Attendance Rate */}
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-medium text-slate-600 sm:text-sm">Attendance Rate</p>
          <p className="mt-2 text-3xl font-bold text-orange-600 sm:text-4xl">90%</p>
          <p className="mt-2 text-xs text-slate-500">Monthly average</p>
        </div>
      </div>
    </EmployeeLayout>
  );
}
