'use client';

import EmployeeLayout from '@/components/employee/EmployeeLayout';

/**
 * Employee Profile Page
 * View and manage employee profile information
 */
export default function Profile() {
  return (
    <EmployeeLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Profile</h1>
        <p className="mt-2 text-slate-600">View and manage your profile information</p>
      </div>

      <div className="rounded-xl border border-blue-100 bg-white p-8 text-center">
        <p className="text-slate-600">This page is under development</p>
      </div>
    </EmployeeLayout>
  );
}
