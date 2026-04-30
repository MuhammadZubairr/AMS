/**
 * Loading, Error, and Empty State Components
 */

import React from 'react';

/**
 * Loading skeleton for dashboard
 */
export function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-gray-200 rounded-lg animate-pulse h-24"></div>
        ))}
      </div>
      <div className="bg-gray-200 rounded-lg animate-pulse h-64"></div>
    </div>
  );
}

/**
 * Error state display
 */
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-800 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * Empty state when no data
 */
interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="p-12 text-center">
      <p className="text-2xl font-bold text-gray-900">{title}</p>
      <p className="mt-2 text-gray-600">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
