'use client';

import React, { memo } from 'react';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/superadmin/Badge';
import type { AttendanceOverviewMetric } from '@/types/superadmin';

// Lazy load MetricDonut only when needed
const MetricDonut = dynamic(() => import('@/components/superadmin/MetricDonut'), { 
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm animate-pulse">
      <div className="h-40 w-full rounded-lg bg-slate-100" />
      <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
    </div>
  ),
});

interface AttendanceOverviewSectionProps {
  attendanceOverview: AttendanceOverviewMetric[];
  selected: 'all' | string;
  onSelectChange: (selected: 'all' | string) => void;
  itemsToShow: AttendanceOverviewMetric[];
}

/**
 * Attendance Overview Section Component
 * Renders charts and filters in a separate lazy-loaded component
 * Memoized to prevent unnecessary re-renders
 */
const AttendanceOverviewSection = memo(function AttendanceOverviewSection({
  attendanceOverview,
  selected,
  onSelectChange,
  itemsToShow,
}: AttendanceOverviewSectionProps) {
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
          {attendanceOverview.map((a) => (
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

export default AttendanceOverviewSection;
