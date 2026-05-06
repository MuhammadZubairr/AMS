import React from 'react';

/**
 * HR Dashboard Loading Skeleton
 * Polished skeleton UI while dashboard content loads
 */
export default function HRDashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 p-4 md:p-8">
      <header className="mb-8 space-y-2">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
      </header>

      {/* Stats Cards Skeleton */}
      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white p-6" />
        ))}
      </section>

      {/* Main Sections Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[400px] animate-pulse rounded-xl border border-gray-200 bg-white" />
        <div className="h-[400px] animate-pulse rounded-xl border border-gray-200 bg-white" />
      </div>
    </div>
  );
}
