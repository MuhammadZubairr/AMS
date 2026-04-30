import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ManagerLayout from '@/components/ManagerLayout';
import { managerApi } from '@/services/managerApi';

export default function ManagerTeam() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: teamData, isLoading, error, refetch } = useQuery({
    queryKey: ['manager-team', search, currentPage],
    queryFn: () => managerApi.getTeam({
      search: search || undefined,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    }),
  });

  const employees = teamData?.data?.employees || [];
  const total = teamData?.data?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const getStatusColor = (employee) => {
    // For now, just show active status
    return 'bg-green-100 text-green-800';
  };

  if (isLoading) {
    return (
      <ManagerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Team</h1>
            <p className="text-slate-600">Manage your team members</p>
          </div>

          {/* Search skeleton */}
          <div className="animate-pulse">
            <div className="h-10 w-96 rounded-lg bg-slate-200"></div>
          </div>

          {/* Table skeleton */}
          <div className="animate-pulse overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="h-12 bg-slate-100"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 border-t border-slate-200 bg-white">
                <div className="flex items-center space-x-4 px-6 py-4">
                  <div className="h-4 w-32 rounded bg-slate-200"></div>
                  <div className="h-4 w-48 rounded bg-slate-200"></div>
                  <div className="h-4 w-20 rounded bg-slate-200"></div>
                  <div className="h-6 w-16 rounded bg-slate-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ManagerLayout>
    );
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading team</h3>
              <div className="mt-2 text-sm text-red-700">
                {error.message || 'Something went wrong. Please try again.'}
              </div>
            </div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Team</h1>
          <p className="text-slate-600">Manage your team members</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </form>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white lg:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No team members found
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {employee.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">{employee.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {employee.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {employee.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(employee)}`}>
                        Active
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 lg:hidden">
          {employees.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-500">No team members found</p>
            </div>
          ) : (
            employees.map((employee) => (
              <div key={employee.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {employee.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{employee.name}</div>
                      <div className="text-sm text-slate-500">{employee.email}</div>
                    </div>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(employee)}`}>
                    Active
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {employee.role}
                  </span>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-900">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}