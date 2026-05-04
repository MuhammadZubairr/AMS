'use client';

import type { AttendanceHistoryCardProps } from '@/types/components';

/**
 * Attendance History Card Component
 * Mobile-friendly card view for a single attendance record
 * Displays all attendance information in a stacked card layout
 */
export default function AttendanceHistoryCard({
  record,
  className = '',
}: AttendanceHistoryCardProps) {
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

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-4 space-y-4 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {/* Header: Date and Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-600">Date</p>
          <p className="mt-1 font-semibold text-slate-900">{record.date}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
              record.status
            )}`}
          >
            <span>{getStatusIcon(record.status)}</span>
            {record.status}
          </span>
        </div>
      </div>

      {/* Check In / Check Out */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-600">Check In</p>
          <p className="mt-1 font-semibold text-slate-900">{record.checkIn || '—'}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-600">Check Out</p>
          <p className="mt-1 font-semibold text-slate-900">{record.checkOut || '—'}</p>
        </div>
      </div>

      {/* Working Hours */}
      <div className="rounded-lg bg-slate-50 p-3">
        <p className="text-xs font-medium text-slate-600">Working Hours</p>
        <p className="mt-1 font-semibold text-slate-900">{record.workingHours || '—'}</p>
      </div>

      {/* Work Type Badge */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-600">Work Type</p>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getWorkTypeColor(
            record.workType
          )}`}
        >
          {record.workType || '—'}
        </span>
      </div>
    </div>
  );
}
