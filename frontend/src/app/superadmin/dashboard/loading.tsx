/**
 * Dashboard Loading Skeleton
 * Renders immediately while page compiles and loads
 * Provides visual feedback and prevents blank white screen
 */

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navbar skeleton */}
      <div className="fixed right-0 top-0 z-30 h-16 w-full border-b border-slate-200 bg-white/95 px-6 md:left-72">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-slate-200 animate-pulse" />
            <div className="h-5 w-48 rounded bg-slate-200 animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-9 w-40 rounded-lg bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main content with padding for navbar + sidebar */}
      <main className="pb-8 pt-24 ml-72">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Stats cards skeleton - 4 cards grid */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
                >
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
            </section>

            {/* Content grid skeleton */}
            <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
              {/* Attendance overview skeleton */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
                <div className="space-y-4">
                  <div>
                    <div className="h-3 w-32 rounded bg-slate-200" />
                    <div className="mt-2 h-6 w-48 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-56 rounded bg-slate-200" />
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-8 w-24 rounded-full bg-slate-200" />
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 animate-pulse">
                        <div className="h-32 w-full rounded-lg bg-slate-200" />
                        <div className="mt-2 h-3 w-full rounded bg-slate-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick actions skeleton */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
                <div className="space-y-4">
                  <div>
                    <div className="h-3 w-32 rounded bg-slate-200" />
                    <div className="mt-2 h-6 w-40 rounded bg-slate-200" />
                  </div>
                  <div className="mt-6 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-12 rounded-2xl border border-slate-200 bg-slate-50" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent activity skeleton */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
              <div className="space-y-4">
                <div>
                  <div className="h-3 w-32 rounded bg-slate-200" />
                  <div className="mt-2 h-6 w-56 rounded bg-slate-200" />
                </div>
                <div className="mt-6 space-y-3 rounded-3xl border border-slate-200">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 bg-slate-50" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
