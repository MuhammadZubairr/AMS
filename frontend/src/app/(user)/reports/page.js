'use client';

import { useEffect, useState } from 'react';
import EmployeeLayout from '@/components/employee/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function formatDuration(seconds) {
  if (!seconds) return '0h 0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_URL}/api/attendance/summary`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Unable to load reports');
        }

        setSummary(data.data.summary);
        setRecent(data.data.history || []);
      } catch (err) {
        setError(err.message || 'Unable to load reports');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <EmployeeLayout title="Reports">
      <div className="space-y-6">
        <div className="rounded-2xl border border-blue-100 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">My Attendance Summary</h2>
          <p className="mt-2 text-sm text-slate-600">Monthly attendance details and recent activity.</p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">Total Logged Days</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{summary?.total_days || 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">Present</p>
                <p className="mt-3 text-3xl font-semibold text-green-600">{summary?.present_days || 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">Late</p>
                <p className="mt-3 text-3xl font-semibold text-yellow-600">{summary?.late_days || 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">Absent</p>
                <p className="mt-3 text-3xl font-semibold text-red-600">{summary?.absent_days || 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">Average Working Time</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{formatDuration(summary?.average_working_seconds)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Recent Attendance</h3>
                  <p className="text-sm text-slate-600">Last 10 attendance records.</p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm text-slate-700">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Check In</th>
                      <th className="px-4 py-3">Check Out</th>
                      <th className="px-4 py-3">Mode</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((item) => (
                      <tr key={item.id} className="border-b border-slate-200">
                        <td className="px-4 py-3">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{item.check_in ? new Date(item.check_in).toLocaleTimeString() : '—'}</td>
                        <td className="px-4 py-3">{item.check_out ? new Date(item.check_out).toLocaleTimeString() : '—'}</td>
                        <td className="px-4 py-3">{item.mode || '—'}</td>
                        <td className="px-4 py-3 capitalize">{item.status || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </EmployeeLayout>
  );
}
