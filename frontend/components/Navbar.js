import Logout from './Logout';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-blue-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600 sm:text-sm">DevFlx</p>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">Attendance Management</h2>
          </div>
        </div>
        <nav className="flex w-full items-center gap-2 overflow-x-auto pb-1 text-sm font-medium text-slate-600 sm:gap-3 lg:w-auto lg:flex-wrap lg:justify-end">
          <a href="/dashboard" className="shrink-0 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700">Dashboard</a>
          <a href="/employees" className="shrink-0 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700">Employees</a>
          <a href="/attendance" className="shrink-0 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700">Attendance</a>
          <a href="/reports" className="shrink-0 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700">Reports</a>
          <div className="shrink-0 pl-1">
            <Logout />
          </div>
        </nav>
      </div>
    </header>
  );
}
