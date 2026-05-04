import React from 'react';

/**
 * Employee Dashboard Loading Skeleton
 * Polished skeleton UI while dashboard content loads
 */
export default function EmployeeDashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Navbar Skeleton */}
      <div className="sticky top-0 z-20 border-b border-blue-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-slate-200" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar Skeleton */}
        <div className="hidden w-72 border-r border-blue-100 bg-white p-5 lg:block">
          <div className="mb-4 h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Welcome Card Skeleton */}
            <div className="mb-8 animate-pulse rounded-xl border border-blue-100 bg-white p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-2">
                  <div className="h-10 w-3/4 rounded-lg bg-slate-200" />
                  <div className="h-4 w-1/2 rounded-lg bg-slate-200" />
                </div>
                <div className="h-10 w-32 rounded-lg bg-slate-200" />
              </div>
            </div>

            {/* Action Cards Skeleton */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="animate-pulse rounded-xl border border-blue-100 bg-white p-6 sm:p-8 lg:col-span-2">
                <div className="h-8 w-32 rounded-lg bg-slate-200 mb-6" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-slate-200" />
                  ))}
                </div>
              </div>
              <div className="animate-pulse rounded-xl border border-blue-100 bg-white p-6 sm:p-8">
                <div className="h-8 w-32 rounded-lg bg-slate-200 mb-6" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-slate-200" />
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Cards Skeleton */}
            <div className="mb-8">
              <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-blue-100 bg-white p-6 sm:p-8"
                  >
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded-lg bg-slate-200" />
                      <div className="h-8 w-16 rounded-lg bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="animate-pulse rounded-xl border border-blue-100 bg-white p-6 sm:p-8">
              <div className="mb-6 h-8 w-48 rounded-lg bg-slate-200" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 rounded-lg bg-slate-200" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
