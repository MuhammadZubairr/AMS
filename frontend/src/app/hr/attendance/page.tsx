'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import HRLayout from '@/components/hr/Layout';

interface AttendanceRecord {
  id: number;
  user_id: number;
  user_name: string;
  mode: 'OFFICE' | 'REMOTE';
  check_in_time: string;
  check_out_time: string | null;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  working_minutes: number | null;
}

interface AttendanceResponse {
  attendance: AttendanceRecord[];
  total: number;
}

export default function HRAttendancePage() {
  const [period, setPeriod] = useState<'today' | 'weekly' | 'monthly'>('today');

  const { data, isLoading, error } = useQuery<AttendanceResponse>({
    queryKey: ['hrAttendance', period],
    queryFn: async () => {
      const response = await fetch(`/api/hr/attendance?period=${period}`, {
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch attendance');
      return result.data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'OFFICE':
        return 'bg-blue-100 text-blue-800';
      case 'REMOTE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return '—';
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '—';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Attendance Records</h2>
          <p className="text-gray-600 mt-1">View employee attendance history</p>
        </div>

        {/* Period filter */}
        <div className="flex gap-4">
          {(['today', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Failed to load attendance records. Please try again.</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Attendance table */}
        {!isLoading && data && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            {data.attendance.length > 0 ? (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Mode
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Check In
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Check Out
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.attendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {record.user_name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getModeColor(record.mode)}`}>
                            {record.mode}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatTime(record.check_in_time)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatTime(record.check_out_time)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDuration(record.working_minutes)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Total records: {data.total}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No attendance records found for the selected period.
              </div>
            )}
          </div>
        )}
      </div>
    </HRLayout>
  );
}
