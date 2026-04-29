import Navbar from '../../components/Navbar';

export default function AttendancePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-blue-100">
          <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
          <p className="mt-2 text-slate-600">Check-in and check-out records will appear here.</p>
        </div>
      </section>
    </main>
  );
}
