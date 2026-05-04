'use client';

import { useEffect, useState } from 'react';
import { healthApi } from '@/services/api';
import type { DatabaseStatusProps } from '@/types/components';

interface StatusState {
  status: 'checking' | 'connected' | 'error';
  message: string;
}

/**
 * DatabaseStatus Component
 * Displays the current database connection status
 */
export default function DatabaseStatus({ className = '' }: DatabaseStatusProps) {
  const [state, setState] = useState<StatusState>({
    status: 'checking',
    message: 'Checking database connection...',
  });

  useEffect(() => {
    let mounted = true;

    const loadStatus = async (): Promise<void> => {
      const result = await healthApi.database();

      if (!mounted) {
        return;
      }

      if (result.ok) {
        setState({
          status: 'connected',
          message: 'Database connected successfully.',
        });
        return;
      }

      setState({
        status: 'error',
        message: result.error || 'Database connection failed.',
      });
    };

    loadStatus();

    return () => {
      mounted = false;
    };
  }, []);

  const statusClasses =
    state.status === 'connected'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : state.status === 'error'
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return (
    <div className={`rounded-3xl border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] ${statusClasses} ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em]">Database</p>
      <p className="mt-2 text-lg font-bold sm:text-xl">
        {state.status === 'connected' ? 'Connected' : state.status === 'error' ? 'Unavailable' : 'Checking...'}
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-6 opacity-90">{state.message}</p>
    </div>
  );
}
