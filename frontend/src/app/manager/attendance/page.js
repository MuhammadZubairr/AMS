'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ManagerLayout from '@/components/ManagerLayout';
import { managerApi } from '@/services/managerApi';

export default function ManagerAttendance() {
  const [period, setPeriod] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data: attendanceData, isLoading, error } = useQuery({
    queryKey: ['manager-attendance', period, currentPage],
    queryFn: () => managerApi.getTeamAttendance({
      period,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    }),
  });

  const attendance = attendanceData?.data?.attendance || [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getModeColor = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'office':
        return 'bg-blue-100 text-blue-800';
      case 'remote':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) {
    return (
      <ManagerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Team Attendance</h1>
            <p className="text-slate-600">Monitor your team's attendance records</p>
          </div>

          {/* Filters skeleton */}
          <div className="animate-pulse flex gap-4">
            <div className="h-10 w-32 rounded-lg bg-slate-200"></div>
          </div>

          {/* Table skeleton */}
          <div className="animate-pulse overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="h-12 bg-slate-100"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 border-t border-slate-200 bg-white">
                <div className="flex items-center space-x-4 px-6 py-4">
                  <div className="h-4 w-32 rounded bg-slate-200"></div>
                  <div className="h-4 w-24 rounded bg-slate-200"></div>
                  <div className="h-4 w-20 rounded bg-slate-200"></div>
                  <div className="h-4 w-16 rounded bg-slate-200"></div>
                  <div className="h-4 w-20 rounded bg-slate-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ManagerLayout>
    );
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading attendance</h3>
              <div className="mt-2 text-sm text-red-700">
                {error.message || 'Something went wrong. Please try again.'}
              </div>
            </div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Attendance</h1>
          <p className="text-slate-600">Monitor your team's attendance records</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-slate-700 mb-1">
              Period
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white lg:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Working Hours
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No attendance records found for {period}
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record.user_id + record.date} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {record.employee_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">{record.employee_name}</div>
                          <div className="text-sm text-slate-500">{record.employee_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {record.check_in ? new Date(record.check_in).toLocaleTimeString() : '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {record.check_out ? new Date(record.check_out).toLocaleTimeString() : '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getModeColor(record.mode)}`}>
                        {record.mode || 'N/A'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status || 'N/A'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {record.working_hours || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 lg:hidden">
          {attendance.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-500">No attendance records found for {period}</p>
            </div>
          ) : (
            attendance.map((record) => (
              <div key={record.user_id + record.date} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {record.employee_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{record.employee_name}</div>
                      <div className="text-sm text-slate-500">{record.employee_email}</div>
                    </div>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status || 'N/A'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-500">Check In:</span>
                    <div className="text-slate-900">
                      {record.check_in ? new Date(record.check_in).toLocaleTimeString() : '-'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">Check Out:</span>
                    <div className="text-slate-900">
                      {record.check_out ? new Date(record.check_out).toLocaleTimeString() : '-'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">Mode:</span>
                    <div>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getModeColor(record.mode)}`}>
                        {record.mode || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">Working Hours:</span>
                    <div className="text-slate-900">{record.working_hours || '-'}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {attendance.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Summary</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {attendance.filter(r => r.status?.toLowerCase() === 'present').length}
                </div>
                <div className="text-sm text-slate-500">Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {attendance.filter(r => r.status?.toLowerCase() === 'late').length}
                </div>
                <div className="text-sm text-slate-500">Late</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {attendance.filter(r => r.status?.toLowerCase() === 'absent').length}
                </div>
                <div className="text-sm text-slate-500">Absent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600">
                  {attendance.length}
                </div>
                <div className="text-sm text-slate-500">Total</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}