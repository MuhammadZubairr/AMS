'use client';

import React, { Suspense, memo } from 'react';
import dynamic from 'next/dynamic';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { StatCard } from '@/components/superadmin/StatCard';
import { dashboardMetrics, attendanceOverview, recentActivities } from '@/components/superadmin/mockData';
import { Badge } from '@/components/superadmin/Badge';
import { SuperAdminIcon } from '@/components/superadmin/Icon';

// Lazy load only MetricDonut (contains recharts)
const MetricDonut = dynamic(() => import('@/components/superadmin/MetricDonut'), { 
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm animate-pulse">
      <div className="h-40 w-full rounded-lg bg-slate-100" />
      <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
    </div>
  ),
});

// Inlined AttendanceOverviewSection
const AttendanceOverviewSection = memo(function AttendanceOverviewSection({
  attendanceOverview: items,
  selected,
  onSelectChange,
  itemsToShow,
}: {
  attendanceOverview: Array<{ title: string; value: number; color: string }>;
  selected: string | 'all';
  onSelectChange: (val: string | 'all') => void;
  itemsToShow: Array<{ title: string; value: number; color: string }>;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Attendance overview</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Live workforce snapshot</h2>
          <p className="mt-2 text-sm text-slate-500">Present, absent, and work mode metrics for today.</p>
        </div>
        <Badge label="Updated just now" variant="primary" size="sm" />
      </div>

      <div className="mt-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectChange('all')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              selected === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {items.map((a) => (
            <button
              key={a.title}
              onClick={() => onSelectChange(a.title)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                selected === a.title ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {a.title}
            </button>
          ))}
        </div>

        <div className={`grid gap-4 ${itemsToShow.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
          {itemsToShow.map((item) => (
            <MetricDonut
              key={item.title}
              title={item.title}
              value={item.value}
              color={item.color}
              isFocused={selected !== 'all' && selected === item.title}
              onClick={() => onSelectChange(selected === item.title ? 'all' : item.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

// Inlined QuickActionsSection
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

// Inlined RecentActivitiesSection
const RecentActivitiesSection = memo(function RecentActivitiesSection({
  recentActivities: activities,
}: {
  recentActivities: Array<{ user: string; action: string; role: string; date: string }>;
}) {
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
            {activities.map((activity) => (
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

// Skeleton for statistics cards
function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="mt-3 h-8 w-32 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-16 rounded bg-slate-200" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [selected, setSelected] = React.useState<'all' | string>('all');
  const itemsToShow = selected === 'all' ? attendanceOverview : attendanceOverview.filter((a) => a.title === selected);

  return (
    <SuperAdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stat Cards - High priority, renders first */}
        <Suspense fallback={<StatCardsSkeleton />}>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardMetrics.map((metric) => (
              <StatCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                color={metric.tone}
                trend={{ value: Number(metric.change.replace(/[^0-9]/g, '') || 0), direction: metric.change.includes('-') ? 'down' : 'up' }}
              />
            ))}
          </section>
        </Suspense>

        {/* Attendance overview + Quick actions - Medium priority */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <Suspense fallback={
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
              <div className="h-64 w-full rounded bg-slate-100" />
            </div>
          }>
            <AttendanceOverviewSection 
              attendanceOverview={attendanceOverview}
              selected={selected}
              onSelectChange={setSelected}
              itemsToShow={itemsToShow}
            />
          </Suspense>

          <Suspense fallback={
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 rounded-2xl bg-slate-100" />
                ))}
              </div>
            </div>
          }>
            <QuickActionsSection />
          </Suspense>
        </div>

        {/* Recent activities - Lower priority */}
        <Suspense fallback={
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
            <div className="space-y-3 rounded-3xl border border-slate-200 p-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 rounded bg-slate-100" />
              ))}
            </div>
          </div>
        }>
          <RecentActivitiesSection recentActivities={recentActivities} />
        </Suspense>
      </div>
    </SuperAdminLayout>
  );
}