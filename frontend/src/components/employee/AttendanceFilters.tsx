'use client';

import type { AttendanceFiltersProps } from '@/types/components';

/**
 * Attendance Filters Component
 * Provides filters for date range, status, and work type
 * Mobile-responsive filter controls
 */
export default function AttendanceFilters({
  onStatusChange,
  onWorkTypeChange,
  onDateRangeChange,
  className = '',
}: AttendanceFiltersProps) {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <h3 className="mb-4 text-lg font-bold text-slate-900 sm:text-base sm:mb-4">Filters</h3>

      {/* Responsive Grid: 1 col mobile, 3 cols desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        {/* Date Range Filter */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-slate-700">Date Range</label>
          <div className="flex gap-2">
            <input
              type="date"
              onChange={(e) => onDateRangeChange?.({ from: e.target.value, to: '' })}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 transition-colors hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
              placeholder="From"
            />
            <input
              type="date"
              onChange={(e) => onDateRangeChange?.({ from: '', to: e.target.value })}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 transition-colors hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
              placeholder="To"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-slate-700">Status</label>
          <select
            onChange={(e) => onStatusChange?.(e.target.value as any)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
          >
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>

        {/* Work Type Filter */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-slate-700">Work Type</label>
          <select
            onChange={(e) => onWorkTypeChange?.(e.target.value as any)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
          >
            <option value="all">All</option>
            <option value="office">Office</option>
            <option value="home">Work From Home</option>
          </select>
        </div>
      </div>
    </div>
  );
}
