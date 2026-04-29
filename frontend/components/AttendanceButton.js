'use client';

import { useState } from 'react';

export default function AttendanceButton() {
  const [status, setStatus] = useState('Not marked yet');

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-blue-50 px-5 py-4">
      <button
        type="button"
        onClick={() => setStatus('Check-in marked')}
        className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Check In
      </button>
      <button
        type="button"
        onClick={() => setStatus('Check-out marked')}
        className="rounded-xl border border-blue-200 px-4 py-2 font-semibold text-blue-700 hover:bg-white"
      >
        Check Out
      </button>
      <p className="text-sm font-medium text-slate-600">{status}</p>
    </div>
  );
}
