'use client';

import { useState } from 'react';
import HRLayout from '@/components/hr/Layout';
import { formatDate } from '@/utils/formatDate';
import { useHRDailyReport, useHRMonthlyReport, useHREmployeeReport } from '@/hooks/hr/useHRReports';

export default function HRReportsPage() {
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'employee'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const { data: dailyData, isLoading: isDailyLoading } = useHRDailyReport(selectedDate, reportType === 'daily');
  const { data: monthlyData, isLoading: isMonthlyLoading } = useHRMonthlyReport(selectedMonth, reportType === 'monthly');
  const { data: employeeData, isLoading: isEmployeeLoading } = useHREmployeeReport(selectedEmployeeId, reportType === 'employee' && selectedEmployeeId !== '');

  const formatTime = (time: string | null) => {
    if (!time) return '—';
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600 mt-1">View attendance and employee reports</p>
        </div>

        {/* Report type tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          {(['daily', 'monthly', 'employee'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                reportType === type
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Report
            </button>
          ))}
        </div>

        {/* Daily Report */}
        {reportType === 'daily' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isDailyLoading && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
              </div>
            )}

            {dailyData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-600">
                  <p className="text-sm font-medium text-gray-700">Total Employees</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{dailyData.total_employees}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-600">
                  <p className="text-sm font-medium text-gray-700">Present</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{dailyData.present_count}</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border-l-4 border-red-600">
                  <p className="text-sm font-medium text-gray-700">Absent</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{dailyData.absent_count}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border-l-4 border-yellow-600">
                  <p className="text-sm font-medium text-gray-700">Late</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{dailyData.late_count}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Monthly Report */}
        {reportType === 'monthly' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isMonthlyLoading && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            )}

            {monthlyData && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Present</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Absent</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Late</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(monthlyData.reports as Array<{ date: string; present: number; absent: number; late: number }>).map((entry, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-700 font-medium">{entry.present}</td>
                        <td className="px-6 py-4 text-sm text-red-700 font-medium">{entry.absent}</td>
                        <td className="px-6 py-4 text-sm text-yellow-700 font-medium">{entry.late}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Employee Report */}
        {reportType === 'employee' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                type="number"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                placeholder="Enter employee ID..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
            </div>

            {isEmployeeLoading && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            )}

            {employeeData && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                {employeeData.reports.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check In</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check Out</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mode</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(employeeData.reports as Array<{ date: string; check_in_time: string; check_out_time: string | null; status: string; mode: string }>).map((entry, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{formatTime(entry.check_in_time)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{formatTime(entry.check_out_time)}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              entry.mode === 'OFFICE'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {entry.mode}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              entry.status === 'PRESENT'
                                ? 'bg-green-100 text-green-800'
                                : entry.status === 'LATE'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {entry.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No attendance records found for this employee.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </HRLayout>
  );
}
