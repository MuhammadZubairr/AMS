/**
 * Reports Page
 */

'use client';

import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { monthlyAttendance, departmentComparison, wfhVsWfo, attendanceOverview } from '@/components/superadmin/mockData';
import * as ReportsCharts from '@/components/superadmin/ReportsCharts';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('monthly');

  const pieColors = ['#2563EB', '#8B5CF6'];

  return (
    <SuperAdminLayout title="Reports">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-600">View comprehensive attendance and department analytics.</p>
        </div>

        {/* Report Selection Tabs */}
        <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
          {[
            { id: 'monthly', label: 'Monthly Attendance' },
            { id: 'department', label: 'Department Comparison' },
            { id: 'workmode', label: 'WFH vs WFO' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedReport === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Monthly Attendance Report */}
        {selectedReport === 'monthly' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Monthly Attendance Trends</h2>
              <p className="mt-1 text-sm text-slate-600">Average attendance rate by month</p>
            </div>
            <div className="h-80">
              <ReportsCharts.MonthlyLine data={monthlyAttendance} />
            </div>
          </div>
        )}

        {/* Department Comparison Report */}
        {selectedReport === 'department' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Department Comparison</h2>
              <p className="mt-1 text-sm text-slate-600">Total employees by department</p>
            </div>
            <div className="h-80">
              <ReportsCharts.DepartmentBar data={departmentComparison} />
            </div>
          </div>
        )}

        {/* WFH vs WFO Report */}
        {selectedReport === 'workmode' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Work From Home vs Office</h2>
              <p className="mt-1 text-sm text-slate-600">Distribution of work modes today</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-80">
                <ReportsCharts.WorkmodePie data={wfhVsWfo} colors={pieColors} />
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-600">WFH Distribution</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {wfhVsWfo[0]?.value || 0}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {(((wfhVsWfo[0]?.value || 0) / ((wfhVsWfo[0]?.value || 0) + (wfhVsWfo[1]?.value || 1))) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-600">WFO Distribution</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {wfhVsWfo[1]?.value || 0}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {(((wfhVsWfo[1]?.value || 0) / ((wfhVsWfo[0]?.value || 0) + (wfhVsWfo[1]?.value || 1))) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {attendanceOverview.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">{item.title}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
              <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ backgroundColor: item.color, width: `${(item.value / 250) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
