'use client';

import React, { memo } from 'react';
import { SuperAdminIcon } from '@/components/superadmin/Icon';
import type { RecentActivity } from '@/types/superadmin';

interface RecentActivitiesSectionProps {
  recentActivities: RecentActivity[];
}

/**
 * Recent Activities Section Component
 * Renders activity table in a separate lazy-loaded component
 * Memoized to prevent unnecessary re-renders
 */
const RecentActivitiesSection = memo(function RecentActivitiesSection({
  recentActivities,
}: RecentActivitiesSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Recent activity</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest system actions</h2>
        </div>
        <SuperAdminIcon name="activity" className="h-6 w-6 text-blue-600" />
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['User', 'Action', 'Role', 'Date'].map((header) => (
                <th key={header} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {recentActivities.map((activity) => (
              <tr key={`${activity.user}-${activity.date}`} className="hover:bg-slate-50">
                <td className="px-5 py-4 text-sm font-medium text-slate-900">{activity.user}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{activity.action}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{activity.role}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{activity.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export default RecentActivitiesSection;
