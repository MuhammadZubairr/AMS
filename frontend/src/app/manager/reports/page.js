'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ManagerLayout from '@/components/ManagerLayout';
import { managerApi } from '@/services/managerApi';

export default function ManagerReports() {
  const [period, setPeriod] = useState('weekly');

  const { data: reportsData, isLoading, error } = useQuery({
    queryKey: ['manager-reports', period],
    queryFn: () => managerApi.getReports({ period }),
  });

  const report = reportsData?.data?.report || [];

  // Calculate summary stats
  const totalDays = report.length;
  const totalPresent = report.reduce((sum, day) => sum + (day.present || 0), 0);
  const totalAbsent = report.reduce((sum, day) => sum + (day.absent || 0), 0);
  const totalLate = report.reduce((sum, day) => sum + (day.late || 0), 0);
  const averagePresent = totalDays > 0 ? Math.round((totalPresent / totalDays) * 10) / 10 : 0;
  const averageAbsent = totalDays > 0 ? Math.round((totalAbsent / totalDays) * 10) / 10 : 0;
  const averageLate = totalDays > 0 ? Math.round((totalLate / totalDays) * 10) / 10 : 0;

  if (isLoading) {
    return (
      <ManagerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
            <p className="text-slate-600">View attendance analytics and performance metrics</p>
          </div>

          {/* Filters skeleton */}
          <div className="animate-pulse flex gap-4">
            <div className="h-10 w-32 rounded-lg bg-slate-200"></div>
          </div>

          {/* Cards skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border border-slate-200 bg-white p-6">
                <div className="h-4 w-20 rounded bg-slate-200 mb-2"></div>
                <div className="h-8 w-16 rounded bg-slate-200"></div>
              </div>
            ))}
          </div>

          {/* Chart skeleton */}
          <div className="animate-pulse rounded-lg border border-slate-200 bg-white p-6">
            <div className="h-6 w-32 rounded bg-slate-200 mb-4"></div>
            <div className="h-64 w-full rounded bg-slate-200"></div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading reports</h3>
              <div className="mt-2 text-sm text-red-700">
                {error.message || 'Something went wrong. Please try again.'}
              </div>
            </div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600">View attendance analytics and performance metrics</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-slate-700 mb-1">
              Report Period
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Present/Day</p>
                <p className="text-2xl font-bold text-green-600">{averagePresent}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Absent/Day</p>
                <p className="text-2xl font-bold text-red-600">{averageAbsent}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Late/Day</p>
                <p className="text-2xl font-bold text-yellow-600">{averageLate}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Days</p>
                <p className="text-2xl font-bold text-blue-600">{totalDays}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Trend Chart */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Attendance Trend ({period === 'weekly' ? 'Last 7 Days' : 'This Month'})
          </h3>

          {report.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-slate-500">
              No data available for the selected period
            </div>
          ) : (
            <div className="space-y-4">
              {/* Simple bar chart representation */}
              {report.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">
                      {new Date(day.day).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-green-600">Present: {day.present || 0}</span>
                      <span className="text-red-600">Absent: {day.absent || 0}</span>
                      <span className="text-yellow-600">Late: {day.late || 0}</span>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="flex h-4 space-x-1">
                    <div
                      className="bg-green-500 rounded-l"
                      style={{ width: `${day.total ? ((day.present || 0) / day.total) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-yellow-500"
                      style={{ width: `${day.total ? ((day.late || 0) / day.total) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-red-500 rounded-r"
                      style={{ width: `${day.total ? ((day.absent || 0) / day.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Table */}
        {report.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Detailed Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Present
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Absent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Late
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Attendance Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {report.map((day, index) => {
                    const attendanceRate = day.total ? Math.round(((day.present || 0) / day.total) * 100) : 0;
                    return (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                          {new Date(day.day).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-green-600 font-medium">
                          {day.present || 0}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-red-600 font-medium">
                          {day.absent || 0}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-yellow-600 font-medium">
                          {day.late || 0}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900 font-medium">
                          {day.total || 0}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                          {attendanceRate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}