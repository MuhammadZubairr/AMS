/**
 * Reusable Super Admin Components
 * StatCard component for dashboard
 */

import React, { memo } from 'react';
import { SuperAdminIcon } from './Icon';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode | string;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-200 text-blue-600',
  green: 'bg-green-50 border-green-200 text-green-600',
  red: 'bg-red-50 border-red-200 text-red-600',
  purple: 'bg-purple-50 border-purple-200 text-purple-600',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
};

const iconColorClasses: Record<string, string> = {
  blue: 'text-blue-400',
  green: 'text-green-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
  yellow: 'text-yellow-400',
};

/**
 * StatCard Component
 * Memoized to prevent unnecessary re-renders
 */
export const StatCard = memo(function StatCard({
  title,
  value,
  icon,
  color = 'blue',
  trend,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        {icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 ${iconColorClasses[color]}`}>
            {typeof icon === 'string' ? <SuperAdminIcon name={icon as any} className="h-6 w-6" /> : icon}
          </div>
        )}
      </div>
    </div>
  );
});
