import EmployeeLayout from '@/components/employee/EmployeeLayout';

/**
 * Attendance History Loading Skeleton
 * Shows placeholder UI while page data is loading
 * Prevents layout shift (CLS = 0)
 */
export default function AttendanceHistoryLoading() {
  return (
    <EmployeeLayout>
      {/* Page Header Skeleton */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="mb-2 h-10 w-64 animate-pulse rounded-lg bg-slate-200 sm:h-12" />
          <div className="h-5 w-80 animate-pulse rounded-lg bg-slate-200 sm:w-96" />
        </div>

        {/* Month Selector Skeleton */}
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="h-5 w-24 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>

      {/* Month Display Skeleton */}
      <div className="mb-6 h-5 w-48 animate-pulse rounded-lg bg-slate-200" />

      {/* Filters Skeleton */}
      <div className="mb-8 rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="mb-4 h-6 w-20 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-16 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Summary Cards Skeleton */}
      <div className="mb-8">
        <div className="mb-4 h-6 w-32 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
              <div className="mb-2 h-4 w-20 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-8 w-12 animate-pulse rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton (Desktop) */}
      <div className="mb-8 hidden rounded-xl border border-blue-100 bg-white p-6 shadow-sm sm:block">
        <div className="mb-6 h-6 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </div>

      {/* Cards Skeleton (Mobile) */}
      <div className="mb-8 space-y-4 sm:hidden">
        <div className="h-6 w-48 animate-pulse rounded-lg bg-slate-200" />
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200 bg-white p-4 space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="mb-2 h-4 w-12 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-5 w-20 animate-pulse rounded-lg bg-slate-200" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200" />
              <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200" />
            </div>
            <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-12 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-3 h-4 w-32 animate-pulse rounded-lg bg-slate-200" />
            <div className="mb-3 h-10 w-20 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>
    </EmployeeLayout>
  );
}
