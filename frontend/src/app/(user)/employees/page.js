import Navbar from '@/components/Navbar';
import EmployeeTable from '@/components/EmployeeTable';

export default function EmployeesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <EmployeeTable />
      </section>
    </main>
  );
}
