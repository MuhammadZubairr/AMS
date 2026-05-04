/**
 * Attendance Monitoring Page
 */

'use client';

import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { SuperAdminIcon } from '@/components/superadmin/Icon';
import { Badge } from '@/components/superadmin/Badge';
import { attendanceRecords as mockAttendanceRecords } from '@/components/superadmin/mockData';
import { AttendanceMonitoringRecord } from '@/types/superadmin';

export default function AttendancePage() {
  const [records] = useState<AttendanceMonitoringRecord[]>(mockAttendanceRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const departments = Array.from(new Set(records.map((r) => r.department)));
  const workTypes = ['Work From Office', 'Work From Home'];

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || record.department === selectedDepartment;
    const matchesWorkType = !selectedWorkType || record.workType === selectedWorkType;
    const matchesDate = !selectedDate || record.date === selectedDate;

    return matchesSearch && matchesDepartment && matchesWorkType && matchesDate;
  });

  const stats = {
    total: filteredRecords.length,
    presentOnSite: filteredRecords.filter((r) => r.workType === 'Work From Office').length,
    workingFromHome: filteredRecords.filter((r) => r.workType === 'Work From Home').length,
    gpsVerified: filteredRecords.filter((r) => r.gpsVerified).length,
  };

  return (
    <SuperAdminLayout title="Attendance Monitoring">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Monitoring</h1>
          <p className="mt-1 text-sm text-slate-600">View and manage employee attendance records with GPS verification.</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Total Present</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <SuperAdminIcon name="users" className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Office</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stats.presentOnSite}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <SuperAdminIcon name="office" className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Work From Home</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stats.workingFromHome}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <SuperAdminIcon name="office" className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">GPS Verified</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stats.gpsVerified}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <SuperAdminIcon name="location" className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-slate-900">
                Search Employee
              </label>
              <div className="relative mt-1">
                <SuperAdminIcon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-900">
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Work Type Filter */}
            <div>
              <label htmlFor="workType" className="block text-sm font-medium text-slate-900">
                Work Type
              </label>
              <select
                id="workType"
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {workTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
                  setSelectedDepartment('');
                  setSelectedWorkType('');
                  setSelectedDate('');
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Employee Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Check In
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Check Out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Work Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    GPS Verified
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{record.employeeName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{record.department}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{record.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{record.checkIn}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{record.checkOut}</td>
                      <td className="px-6 py-4 text-sm">
                        <Badge
                          label={record.workType}
                          variant={record.workType === 'Work From Office' ? 'success' : 'info'}
                          size="sm"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge
                          label={record.gpsVerified ? 'Verified' : 'Not Verified'}
                          variant={record.gpsVerified ? 'success' : 'danger'}
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-600">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
