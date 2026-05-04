'use client';

import type { RecentAttendanceTableProps } from '@/types/components';

/**
 * Recent Attendance Table Component
 * Displays last 5 attendance records
 * Responsive: table on desktop, cards on mobile
 */
export default function RecentAttendanceTable({
  data = [],
  loading = false,
  className = '',
}: RecentAttendanceTableProps) {
  if (loading) {
    return (
      <div className={`rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8 ${className}`}>
        <h2 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">Recent Attendance</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8 ${className}`}>
      <h2 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">Recent Attendance</h2>

      {data.length === 0 ? (
        <div className="rounded-lg bg-slate-50 p-8 text-center">
          <p className="text-slate-600">No attendance records yet</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="space-y-4 sm:hidden">
            {data.map((record, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600">Date</p>
                    <p className="mt-1 font-semibold text-slate-900">{record.date}</p>
                  </div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      record.status === 'Present'
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'Absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-600">Check In</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{record.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-600">Check Out</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{record.checkOut}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-600">Work Type</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{record.workType}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    Check In
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    Check Out
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    Work Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 text-sm text-slate-900 font-medium">{record.date}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{record.checkIn}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{record.checkOut}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{record.workType}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          record.status === 'Present'
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'Absent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
