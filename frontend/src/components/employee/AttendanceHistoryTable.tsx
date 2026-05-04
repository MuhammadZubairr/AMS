'use client';

import type { AttendanceHistoryTableProps } from '@/types/components';

/**
 * Attendance History Table Component
 * Desktop table view for attendance records
 * Shows all columns: Date, Check In, Check Out, Hours, Work Type, Status
 * Responsive: hidden on mobile, visible on desktop
 */
export default function AttendanceHistoryTable({
  data = [],
  loading = false,
  className = '',
}: AttendanceHistoryTableProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getWorkTypeColor = (workType: string) => {
    switch (workType?.toLowerCase()) {
      case 'office':
        return 'bg-blue-100 text-blue-800';
      case 'home':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'present':
        return '✓';
      case 'absent':
        return '✕';
      case 'late':
        return '⏱';
      default:
        return '○';
    }
  };

  if (loading) {
    return (
      <div
        className={`hidden rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:block ${className}`}
      >
        <h2 className="mb-6 text-lg font-bold text-slate-900 sm:text-xl">Attendance History</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`hidden rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:block ${className}`}
      >
        <h2 className="mb-6 text-lg font-bold text-slate-900 sm:text-xl">Attendance History</h2>
        <div className="rounded-lg bg-slate-50 p-8 text-center">
          <p className="text-slate-600">No attendance records found for this period</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`hidden rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:block ${className}`}
    >
      <h2 className="mb-6 text-lg font-bold text-slate-900 sm:text-xl">Attendance History</h2>

      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Check In
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Check Out
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Working Hours
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Work Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-100 transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{record.date}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{record.checkIn || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{record.checkOut || '—'}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {record.workingHours || '—'}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getWorkTypeColor(
                      record.workType
                    )}`}
                  >
                    {record.workType || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                      record.status
                    )}`}
                  >
                    <span>{getStatusIcon(record.status)}</span>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
