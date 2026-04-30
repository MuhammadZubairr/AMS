/**
 * Reusable Super Admin Components
 * StatCard component for dashboard
 */

import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
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

export function StatCard({
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
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        {icon && <div className={`text-3xl ${iconColorClasses[color]}`}>{icon}</div>}
      </div>
    </div>
  );
}
