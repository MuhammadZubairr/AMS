'use client';

import type { TodayAttendanceCardProps } from '@/types/components';

/**
 * Today's Attendance Card Component
 * Displays detailed breakdown of today's attendance: check-in, check-out, work type, status, and working hours
 */
export default function TodayAttendanceCard({
  checkInTime = null,
  checkOutTime = null,
  workType = null,
  status = null,
  workingHours = null,
  className = '',
}: TodayAttendanceCardProps) {
  const getStatusColor = (s: string | null) => {
    switch (s) {
      case 'checked-in':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'checked-out':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getWorkTypeLabel = (type: string | null) => {
    switch (type) {
      case 'office':
        return '🏢 Work From Office';
      case 'home':
        return '🏠 Work From Home';
      default:
        return '—';
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return '—';
    return time;
  };

  return (
    <div className={`rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8 ${className}`}>
      <h2 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">Today's Attendance</h2>

      {/* Attendance Details Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Check In Time */}
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-600 sm:text-sm">Check In</p>
          <p className="mt-2 text-lg font-bold text-blue-600 sm:text-xl">
            {formatTime(checkInTime)}
          </p>
          <p className="text-xs text-slate-500">Morning entry</p>
        </div>

        {/* Check Out Time */}
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-600 sm:text-sm">Check Out</p>
          <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
            {formatTime(checkOutTime)}
          </p>
          <p className="text-xs text-slate-500">Evening exit</p>
        </div>

        {/* Work Type */}
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-600 sm:text-sm">Work Type</p>
          <p className="mt-2 text-sm font-bold text-slate-900 sm:text-base">
            {getWorkTypeLabel(workType)}
          </p>
          <p className="text-xs text-slate-500">Location</p>
        </div>

        {/* Status */}
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-600 sm:text-sm">Status</p>
          <div className="mt-2">
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                status
              )}`}
            >
              {status === 'checked-in'
                ? 'Checked In'
                : status === 'checked-out'
                  ? 'Checked Out'
                  : status === 'absent'
                    ? 'Absent'
                    : 'Not Started'}
            </span>
          </div>
          <p className="text-xs text-slate-500">Current state</p>
        </div>

        {/* Working Hours */}
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-600 sm:text-sm">Working Hours</p>
          <p className="mt-2 text-lg font-bold text-blue-700 sm:text-xl">
            {workingHours || '—'}
          </p>
          <p className="text-xs text-blue-600">Total duration</p>
        </div>
      </div>
    </div>
  );
}
