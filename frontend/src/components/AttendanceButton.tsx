'use client';

import { useState } from 'react';
import type { AttendanceButtonProps } from '@/types/components';

/**
 * AttendanceButton Component
 * Allows users to mark check-in and check-out times
 */
export default function AttendanceButton({ 
  className = '', 
  onClockIn, 
  onClockOut 
}: AttendanceButtonProps) {
  const [status, setStatus] = useState<string>('Not marked yet');

  const handleClockIn = (): void => {
    setStatus('Check-in marked');
    onClockIn?.();
  };

  const handleClockOut = (): void => {
    setStatus('Check-out marked');
    onClockOut?.();
  };

  return (
    <div className={`flex items-center gap-4 rounded-2xl bg-blue-50 px-5 py-4 ${className}`}>
      <button
        type="button"
        onClick={handleClockIn}
        className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Check In
      </button>
      <button
        type="button"
        onClick={handleClockOut}
        className="rounded-xl border border-blue-200 px-4 py-2 font-semibold text-blue-700 hover:bg-white"
      >
        Check Out
      </button>
      <p className="text-sm font-medium text-slate-600">{status}</p>
    </div>
  );
}
