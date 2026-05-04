'use client';

import type { AttendanceSummaryCardProps } from '@/types/components';

/**
 * Attendance Summary Card Component
 * Displays individual attendance metric in a card format
 * Used in My Attendance page to show today's stats
 */
export default function AttendanceSummaryCard({
  label,
  value,
  icon,
  badge,
  className = '',
}: AttendanceSummaryCardProps) {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 sm:text-base">{label}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{value}</p>
          {badge && (
            <p className="mt-2 text-xs font-medium text-blue-600 sm:text-sm">{badge}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-xl sm:h-14 sm:w-14 sm:text-2xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
