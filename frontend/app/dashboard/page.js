import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import AttendanceButton from '../../components/AttendanceButton';
import EmployeeTable from '../../components/EmployeeTable';
import DatabaseStatus from '../../components/DatabaseStatus';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
          <Sidebar />
          <section className="flex-1 space-y-6">
            <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-6 lg:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Overview</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Manage employees, review attendance, and keep the team status visible at a glance.</p>
              <div className="mt-6">
                <AttendanceButton />
              </div>
            </div>
            <DatabaseStatus />
            <EmployeeTable />
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
