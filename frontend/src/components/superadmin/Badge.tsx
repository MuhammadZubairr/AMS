/**
 * Badge Component for displaying roles and statuses
 */

import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

const variantClasses = {
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-purple-100 text-purple-800',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export function Badge({ label, variant = 'primary', size = 'md' }: BadgeProps) {
  return (
    <span
      className={`inline-block font-semibold rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
}
