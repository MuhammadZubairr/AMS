'use client';

import React, { memo } from 'react';
import { SuperAdminIcon } from '@/components/superadmin/Icon';

/**
 * Quick Actions Section Component
 * Renders system shortcuts in a separate lazy-loaded component
 * Memoized to prevent unnecessary re-renders
 */
const QuickActionsSection = memo(function QuickActionsSection() {
  const actions = [
    { label: 'Create user', href: '/superadmin/create-user', icon: 'users' as const },
    { label: 'Manage departments', href: '/superadmin/departments', icon: 'department' as const },
    { label: 'Review attendance', href: '/superadmin/attendance', icon: 'attendance' as const },
    { label: 'Open reports', href: '/superadmin/reports', icon: 'chart' as const },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Quick actions</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">System shortcuts</h2>
        </div>
        <SuperAdminIcon name="dashboard" className="h-6 w-6 text-blue-600" />
      </div>

      <div className="mt-6 grid gap-3">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
                <SuperAdminIcon name={action.icon} className="h-5 w-5" />
              </span>
              {action.label}
            </span>
            <SuperAdminIcon name="collapse" className="h-4 w-4 rotate-180 text-slate-400" />
          </a>
        ))}
      </div>
    </section>
  );
});

export default QuickActionsSection;
