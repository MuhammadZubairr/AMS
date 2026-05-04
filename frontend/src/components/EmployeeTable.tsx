import type { EmployeeTableProps } from '@/types/components';

interface Employee {
  id: number;
  name: string;
  role: string;
  status: string;
}

const employees: Employee[] = [
  { id: 1, name: 'Ava Johnson', role: 'Admin', status: 'Present' },
  { id: 2, name: 'Noah Smith', role: 'Employee', status: 'Checked In' },
  { id: 3, name: 'Mia Lee', role: 'Employee', status: 'Checked Out' },
];

/**
 * EmployeeTable Component
 * Displays a table of employees with their roles and attendance status
 */
export default function EmployeeTable({
  data = employees,
  loading = false,
}: EmployeeTableProps) {
  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Employees</p>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Team overview</h2>
        </div>
      </div>

      {loading && <p className="mt-6 text-center text-slate-600">Loading employees...</p>}

      {!loading && (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {data.map((employee: Employee) => (
                  <tr key={employee.id}>
                    <td className="px-4 py-4 font-medium text-slate-900">{employee.name}</td>
                    <td className="px-4 py-4 text-slate-600">{employee.role}</td>
                    <td className="px-4 py-4 text-slate-600">{employee.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {data.map((employee: Employee) => (
              <article key={employee.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{employee.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{employee.role}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {employee.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
