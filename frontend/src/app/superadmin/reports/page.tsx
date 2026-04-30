/**
 * Reports Page (Placeholder)
 */

'use client';

import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { useDailyReport, useMonthlyReport, useEmployeeReport } from '@/hooks/useSuperAdmin';

export default function ReportsPage() {
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const { data: daily, refetch: refetchDaily, isFetching: loadingDaily } = useDailyReport();
  const { data: monthly, refetch: refetchMonthly, isFetching: loadingMonthly } = useMonthlyReport();
  const { data: employeeReport, refetch: refetchEmployee, isFetching: loadingEmployee } = useEmployeeReport(employeeId);

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and view system reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily Report */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-gray-900 mb-1">Daily Report</h3>
            <p className="text-sm text-gray-600">Attendance summary for today</p>
            <div className="mt-4 space-y-2">
              <div>Present: {daily?.present ?? '—'}</div>
              <div>Absent: {daily?.absent ?? '—'}</div>
              <div>Late: {daily?.late ?? '—'}</div>
              <div>Total: {daily?.total ?? '—'}</div>
              <button
                onClick={() => refetchDaily()}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                {loadingDaily ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Monthly Report */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="font-bold text-gray-900 mb-1">Monthly Report</h3>
            <p className="text-sm text-gray-600">Attendance trends this month (per day)</p>
            <div className="mt-4 max-h-48 overflow-auto text-sm">
              {loadingMonthly && <div>Loading...</div>}
              {!loadingMonthly && monthly?.length === 0 && <div>No data for this month</div>}
              {!loadingMonthly && monthly?.length > 0 && (
                <ul className="space-y-1">
                  {monthly.map((d: any) => (
                    <li key={d.day} className="flex justify-between">
                      <span>{new Date(d.day).toLocaleDateString()}</span>
                      <span>Present: {d.present} — Absent: {d.absent}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => refetchMonthly()}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Employee Report */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl mb-2">👤</div>
            <h3 className="font-bold text-gray-900 mb-1">Employee Report</h3>
            <p className="text-sm text-gray-600">Individual employee attendance</p>
            <div className="mt-4">
              <input
                type="number"
                placeholder="Employee ID"
                value={employeeId ?? ''}
                onChange={(e) => setEmployeeId(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => refetchEmployee()}
                className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                {loadingEmployee ? 'Loading...' : 'Generate'}
              </button>

              <div className="mt-3 max-h-48 overflow-auto text-sm">
                {!loadingEmployee && (!employeeReport || employeeReport.length === 0) && (
                  <div className="text-gray-500">No records</div>
                )}
                {!loadingEmployee && employeeReport && (
                  <ul className="space-y-2">
                    {employeeReport.map((r: any) => (
                      <li key={r.id} className="border-b pb-2">
                        <div>Check In: {r.check_in || '—'}</div>
                        <div>Check Out: {r.check_out || '—'}</div>
                        <div>Status: {r.status}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <p className="text-blue-900">ℹ️ Reports module provides aggregated daily/monthly data and per-employee history. Export and advanced filters coming next.</p>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
