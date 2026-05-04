import React from 'react';

/**
 * My Attendance Page Loading Skeleton
 * Polished skeleton UI while page content loads
 */
export default function MyAttendanceLoading() {
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
            {/* Page Header Skeleton */}
            <div className="mb-8 animate-pulse">
              <div className="h-10 w-64 rounded-lg bg-slate-200" />
              <div className="mt-2 h-5 w-80 rounded-lg bg-slate-200" />
            </div>

            {/* Summary Cards Skeleton */}
            <div className="mb-8">
              <div className="mb-4 h-6 w-40 animate-pulse rounded-lg bg-slate-200" />
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-blue-100 bg-white p-6 sm:p-7"
                  >
                    <div className="space-y-3">
                      <div className="h-4 w-20 rounded-lg bg-slate-200" />
                      <div className="h-8 w-24 rounded-lg bg-slate-200" />
                      <div className="h-3 w-16 rounded-lg bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Working Hours Progress Skeleton */}
            <div className="mb-8 animate-pulse rounded-xl border border-blue-100 bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="h-7 w-48 rounded-lg bg-slate-200" />
                <div className="h-8 w-24 rounded-full bg-slate-200" />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded-lg bg-slate-200" />
                  <div className="h-5 rounded-full bg-slate-200" />
                </div>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 rounded-lg bg-slate-100" />
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline Skeleton */}
            <div className="mb-8">
              <div className="mb-4 h-6 w-40 animate-pulse rounded-lg bg-slate-200" />
              <div className="animate-pulse rounded-xl border border-blue-100 bg-white p-6 sm:p-8">
                <div className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 sm:h-12 sm:w-12" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 rounded-lg bg-slate-200" />
                        <div className="h-3 w-24 rounded-lg bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info Grid Skeleton */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-blue-100 bg-white p-6 sm:p-8">
                  <div className="mb-4 h-6 w-32 rounded-lg bg-slate-200" />
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-4 w-full rounded-lg bg-slate-200" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
