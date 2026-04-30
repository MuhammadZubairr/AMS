/**
 * Attendance Monitoring Page (Placeholder)
 */

'use client';

import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { useAttendance } from '@/hooks/useSuperAdmin';
import { AttendanceRecord } from '@/types/superadmin';

function AttendanceTable({ records }: { records: AttendanceRecord[] }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((r, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.employee_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.check_in ? new Date(r.check_in).toLocaleString() : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.check_out ? new Date(r.check_out).toLocaleString() : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.working_hours}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AttendancePage() {
  const [period, setPeriod] = useState<'today' | 'weekly' | 'monthly'>('today');
  const { data, isLoading, error } = useAttendance(period);

  const records: AttendanceRecord[] = (data as AttendanceRecord[]) || [];

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Monitoring</h1>
            <p className="text-gray-600 mt-1">Monitor employee attendance</p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setPeriod('today')} className={`px-3 py-2 rounded ${period === 'today' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Today</button>
            <button onClick={() => setPeriod('weekly')} className={`px-3 py-2 rounded ${period === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Weekly</button>
            <button onClick={() => setPeriod('monthly')} className={`px-3 py-2 rounded ${period === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Monthly</button>
          </div>
        </div>

        <div>
          {isLoading && <div className="p-6 bg-white rounded border">Loading...</div>}
          {error && <div className="p-6 bg-red-50 rounded border text-red-700">Unable to load attendance</div>}
          {!isLoading && !error && <AttendanceTable records={records} />}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
