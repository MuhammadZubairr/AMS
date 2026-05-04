'use client';

import type { AttendanceSummaryCardProps } from '@/types/components';

/**
 * Attendance Summary Card Component
 * Displays attendance statistics in a card format with icon and color coding
 */
export default function AttendanceSummaryCard({
  label,
  value,
  icon,
  color = 'blue',
  className = '',
}: AttendanceSummaryCardProps) {
  const getColorClasses = (c: string) => {
    switch (c) {
      case 'green':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'orange':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'red':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'blue':
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getIconBgColor = (c: string) => {
    switch (c) {
      case 'green':
        return 'bg-green-100';
      case 'orange':
        return 'bg-orange-100';
      case 'red':
        return 'bg-red-100';
      case 'blue':
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <div
      className={`rounded-xl border ${getColorClasses(color)} p-6 shadow-sm sm:p-8 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600 sm:text-base">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{value}</p>
        </div>
        {icon && (
          <div className={`rounded-lg ${getIconBgColor(color)} p-3 sm:p-4`}>
            <div className="text-lg sm:text-2xl">{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
}
