'use client';

import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { SuperAdminIcon } from '@/components/superadmin/Icon';
import { Badge } from '@/components/superadmin/Badge';
import { activityLogs as mockActivityLogs } from '@/components/superadmin/mockData';
import { ActivityLogRecord } from '@/types/superadmin';

export default function ActivityLogsPage() {
  const [logs] = useState<ActivityLogRecord[]>(mockActivityLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const modules = ['User Management', 'Attendance', 'Office Locations', 'Profile', 'Settings'];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule = !selectedModule || log.module === selectedModule;

    const matchesDate = !selectedDate || log.date.startsWith(selectedDate);

    return matchesSearch && matchesModule && matchesDate;
  });

  const getActionColor = (module: string) => {
    const colors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
      'User Management': 'primary',
      'Attendance': 'success',
      'Office Locations': 'info',
      'Profile': 'warning',
      'Settings': 'danger',
    };
    return colors[module] || 'primary';
  };

  return (
    <SuperAdminLayout title="Activity Logs">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
          <p className="mt-1 text-sm text-slate-600">Monitor all system activities and user actions.</p>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-slate-900">
                Search
              </label>
              <div className="relative mt-1">
                <SuperAdminIcon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="search"
                  type="text"
                  placeholder="Search user, action, IP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Module Filter */}
            <div>
              <label htmlFor="module" className="block text-sm font-medium text-slate-900">
                Module
              </label>
              <select
                id="module"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Modules</option>
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-900">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedModule('');
                  setSelectedDate('');
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Module
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{log.user}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{log.action}</td>
                      <td className="px-6 py-4 text-sm">
                        <Badge label={log.module} variant={getActionColor(log.module)} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{log.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">{log.ipAddress}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-600">
                      No activity logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Total Logs</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{filteredLogs.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Unique Users</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{new Set(filteredLogs.map((l) => l.user)).size}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Unique Modules</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{new Set(filteredLogs.map((l) => l.module)).size}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Unique IPs</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{new Set(filteredLogs.map((l) => l.ipAddress)).size}</p>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
