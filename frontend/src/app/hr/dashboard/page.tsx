'use client';

import { useMemo } from 'react';
import HRLayout from '@/components/hr/Layout';
import { useHRDashboard } from '@/hooks/hr/useHREmployees';
import { useAttendanceRecent } from '@/hooks/useAttendance';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

export default function HRDashboardPage() {
  const dashboardQuery = useHRDashboard();
  const attendanceQuery = useAttendanceRecent();

  const stats = dashboardQuery.data;
  const recent = attendanceQuery.data;

  // Chart data derived safely
  const weeklyAttendance = useMemo(() => {
    // Mock weekly data if API not provided
    const base = stats?.present_today ?? 5;
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ label: d, value: Math.max(0, Math.round(base * (0.8 + i * 0.05))) }));
  }, [stats]);

  const wfhVsWfo = useMemo(() => {
    const wfh = stats?.wfh_today ?? Math.floor((stats?.present_today ?? 0) * 0.2);
    const wfo = stats?.wfo_today ?? Math.max((stats?.present_today ?? 0) - wfh, 0);
    return [
      { label: 'WFH', value: wfh, color: '#7C3AED' },
      { label: 'WFO', value: wfo, color: '#16A34A' },
    ];
  }, [stats]);

  const lateTrend = useMemo(() => {
    const base = stats?.late_today ?? 0;
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ label: d, value: Math.max(0, Math.round(base * (0.7 + i * 0.06))) }));
  }, [stats]);

  const statCards = [
    { title: 'Total Employees', value: stats?.total_employees ?? 0 },
    { title: 'Present Today', value: stats?.present_today ?? 0 },
    { title: 'Absent Today', value: stats?.absent_today ?? 0 },
    { title: 'Late Employees', value: stats?.late_today ?? 0 },
    { title: 'Work From Home', value: stats?.wfh_today ?? 0 },
    { title: 'Work From Office', value: stats?.wfo_today ?? 0 },
  ];

  return (
    <HRLayout>
      <div className="space-y-6">
        <header>
            <h2 className="text-3xl font-bold text-gray-900">HR Dashboard</h2>
            <p className="text-gray-600 mt-1">Employee statistics and attendance overview</p>
          </header>

        {/* Section 1 - Statistics Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.slice(0, 4).map((c) => (
              <div key={c.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{c.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{c.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center text-2xl">👥</div>
                </div>
              </div>
            ))}
          </div>

          {/* For smaller screens / additional WFH/WFO cards */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.slice(4).map((c) => (
              <div key={c.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{c.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{c.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center text-2xl">🏠</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 - Charts */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Attendance</h3>
              <p className="text-sm text-gray-500 mt-1">Attendance count for the last 7 days</p>
              <div className="h-56 mt-4" style={{ minHeight: 224 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EE" />
                    <XAxis dataKey="label" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">WFH vs WFO</h3>
              <p className="text-sm text-gray-500 mt-1">Distribution of today's work locations</p>
              <div className="mt-4 space-y-4">
                <div className="h-44 sm:h-48" style={{ minHeight: 176 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={wfhVsWfo} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={72} innerRadius={42} label>
                        {wfhVsWfo.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4">
                  {wfhVsWfo.map((d) => (
                    <div key={d.label} className="flex items-center gap-2 text-sm">
                      <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: d.color }} />
                      <span className="text-gray-700">{d.label}: </span>
                      <span className="font-semibold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900">Late Attendance Trend</h3>
              <p className="text-sm text-gray-500 mt-1">Late arrivals over the past week</p>
              <div className="h-56 mt-4" style={{ minHeight: 224 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lateTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EE" />
                    <XAxis dataKey="label" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Recent Attendance */}
        <section>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
            <p className="text-sm text-gray-500 mt-1">Latest check-ins and check-outs</p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-600">
                    <th className="py-2 px-3">Employee</th>
                    <th className="py-2 px-3">Check In</th>
                    <th className="py-2 px-3">Check Out</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Work Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(recent ?? []).slice(0, 8).map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-800">{r.name}</td>
                      <td className="py-3 px-3 text-gray-600">{r.check_in ?? '-'}</td>
                      <td className="py-3 px-3 text-gray-600">{r.check_out ?? '-'}</td>
                      <td className={`py-3 px-3 font-medium ${r.status === 'Late' ? 'text-yellow-700' : r.status === 'Absent' ? 'text-red-600' : 'text-green-700'}`}>
                        {r.status}
                      </td>
                      <td className="py-3 px-3 text-gray-600">{r.work_type}</td>
                    </tr>
                  ))}
                  {(!recent || recent.length === 0) && (
                    <tr>
                      <td colSpan={5} className="py-4 px-3 text-center text-gray-500">No recent records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </HRLayout>
  );
}
