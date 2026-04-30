'use client';

import { useEffect, useState } from 'react';
import { healthApi } from '@/services/api';

export default function DatabaseStatus() {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking database connection...');

  useEffect(() => {
    let mounted = true;

    async function loadStatus() {
      const result = await healthApi.database();

      if (!mounted) {
        return;
      }

      if (result.ok) {
        setStatus('connected');
        setMessage('Database connected successfully.');
        return;
      }

      setStatus('error');
      setMessage(result.error || 'Database connection failed.');
    }

    loadStatus();

    return () => {
      mounted = false;
    };
  }, []);

  const statusClasses =
    status === 'connected'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : status === 'error'
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return (
    <div className={`rounded-3xl border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] ${statusClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em]">Database</p>
      <p className="mt-2 text-lg font-bold sm:text-xl">
        {status === 'connected' ? 'Connected' : status === 'error' ? 'Unavailable' : 'Checking...'}
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-6 opacity-90">{message}</p>
    </div>
  );
}