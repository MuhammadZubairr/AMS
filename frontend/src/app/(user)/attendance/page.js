'use client';

import { useEffect, useState } from 'react';
import EmployeeLayout from '@/components/employee/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function formatTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const limit = 20;

  useEffect(() => {
    fetchHistory(offset);
  }, [offset]);

  const fetchHistory = async (nextOffset) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/attendance/history?limit=${limit}&offset=${nextOffset}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.error || 'Failed to load history');
      }

      setRecords(data.data.records || []);
      setTotal(data.data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeLayout title="My Attendance">
      <div className="rounded-2xl border border-blue-100 bg-white p-4">
        {loading && <p className="text-sm text-slate-600">Loading attendance history...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-100 text-left text-slate-600">
                    <th className="px-2 py-2">Date</th>
                    <th className="px-2 py-2">Check In</th>
                    <th className="px-2 py-2">Check Out</th>
                    <th className="px-2 py-2">Mode</th>
                    <th className="px-2 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="px-2 py-3">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="px-2 py-3">{formatTime(row.check_in)}</td>
                      <td className="px-2 py-3">{formatTime(row.check_out)}</td>
                      <td className="px-2 py-3">{row.mode || '-'}</td>
                      <td className="px-2 py-3">{row.status || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {records.length === 0 && <p className="py-4 text-sm text-slate-600">No attendance records yet.</p>}

            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <p className="text-xs text-slate-500">
                Showing {records.length ? offset + 1 : 0}-{Math.min(offset + records.length, total)} of {total}
              </p>
              <button
                type="button"
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= total}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </EmployeeLayout>
  );
}
