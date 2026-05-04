'use client';

import EmployeeLayout from '@/components/employee/EmployeeLayout';

/**
 * Leave Requests Page
 * Manage and view leave requests
 */
export default function LeaveRequests() {
  return (
    <EmployeeLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Leave Requests</h1>
        <p className="mt-2 text-slate-600">Manage your leave requests and approvals</p>
      </div>

      <div className="rounded-xl border border-blue-100 bg-white p-8 text-center">
        <p className="text-slate-600">This page is under development</p>
      </div>
    </EmployeeLayout>
  );
}
