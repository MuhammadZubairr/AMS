'use client';

import type { WorkingHoursProgressProps } from '@/types/components';

/**
 * Working Hours Progress Component
 * Displays daily working hours with progress bar
 * Shows required, completed, and remaining hours
 */
export default function WorkingHoursProgress({
  requiredHours = 8,
  completedHours = 4.5,
  remainingHours = 3.5,
  percentage = 56,
  className = '',
}: WorkingHoursProgressProps) {
  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className={`rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8 ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-slate-900 sm:text-2xl">Working Hours</h3>
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 sm:text-base">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 sm:text-base">Daily Progress</span>
          <span className="text-sm font-medium text-slate-600 sm:text-base">
            {formatHours(completedHours)} / {formatHours(requiredHours)}
          </span>
        </div>

        <div className="relative h-4 overflow-hidden rounded-full bg-slate-100 sm:h-5">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-500 sm:text-sm">
          {percentage < 100
            ? `Keep going! You need ${formatHours(remainingHours)} more hours.`
            : 'Great work! You have completed your daily hours.'}
        </p>
      </div>

      {/* Hours Breakdown */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Required Hours */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center sm:p-5">
          <p className="text-xs font-medium text-slate-600 sm:text-sm">Required</p>
          <p className="mt-2 text-lg font-bold text-slate-900 sm:text-2xl">
            {formatHours(requiredHours)}
          </p>
          <p className="text-xs text-slate-500">Daily target</p>
        </div>

        {/* Completed Hours */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center sm:p-5">
          <p className="text-xs font-medium text-green-700 sm:text-sm">Completed</p>
          <p className="mt-2 text-lg font-bold text-green-900 sm:text-2xl">
            {formatHours(completedHours)}
          </p>
          <p className="text-xs text-green-600">So far today</p>
        </div>

        {/* Remaining Hours */}
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-center sm:p-5">
          <p className="text-xs font-medium text-orange-700 sm:text-sm">Remaining</p>
          <p className="mt-2 text-lg font-bold text-orange-900 sm:text-2xl">
            {formatHours(remainingHours)}
          </p>
          <p className="text-xs text-orange-600">To complete</p>
        </div>
      </div>

      {/* Status Message */}
      <div
        className={`mt-6 rounded-lg border-l-4 p-4 ${
          percentage >= 100
            ? 'border-l-green-500 bg-green-50'
            : percentage >= 75
              ? 'border-l-blue-500 bg-blue-50'
              : 'border-l-orange-500 bg-orange-50'
        }`}
      >
        <p
          className={`text-sm font-medium ${
            percentage >= 100
              ? 'text-green-800'
              : percentage >= 75
                ? 'text-blue-800'
                : 'text-orange-800'
          }`}
        >
          {percentage >= 100
            ? '✓ Excellent! You have completed your daily working hours.'
            : percentage >= 75
              ? '📈 Almost there! Just ' +
                formatHours(remainingHours) +
                ' more to go.'
              : '⏱ Keep tracking! ' +
                formatHours(remainingHours) +
                ' hours remaining.'}
        </p>
      </div>
    </div>
  );
}
