'use client';

import type { MonthlySummaryCardsProps } from '@/types/components';

/**
 * Monthly Summary Cards Component
 * Displays monthly attendance summary statistics
 * Shows Present, Absent, Late, and Work From Home days
 */
export default function MonthlySummaryCards({
  stats = {
    presentDays: 20,
    absentDays: 2,
    lateDays: 1,
    workFromHomeDays: 5,
  },
  loading = false,
  className = '',
}: MonthlySummaryCardsProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6 animate-pulse"
          >
            <div className="h-4 bg-slate-200 rounded mb-3 w-20" />
            <div className="h-8 bg-slate-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Present Days',
      value: stats.presentDays,
      icon: '✓',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Absent Days',
      value: stats.absentDays,
      icon: '✕',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      iconBg: 'bg-red-100',
    },
    {
      label: 'Late Days',
      value: stats.lateDays,
      icon: '⏱',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      iconBg: 'bg-yellow-100',
    },
    {
      label: 'Work From Home',
      value: stats.workFromHomeDays,
      icon: '🏠',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      iconBg: 'bg-purple-100',
    },
  ];

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 ${className}`}>
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`rounded-xl border border-blue-100 ${card.bgColor} p-5 shadow-sm sm:p-6 transition-transform hover:shadow-md hover:scale-105`}
        >
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${card.iconBg} mb-3`}>
            <span className={`text-lg font-bold ${card.textColor}`}>{card.icon}</span>
          </div>

          {/* Label */}
          <p className="text-xs font-medium text-slate-600 sm:text-sm">{card.label}</p>

          {/* Value */}
          <p className={`mt-2 text-3xl font-bold ${card.textColor} sm:text-4xl`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
