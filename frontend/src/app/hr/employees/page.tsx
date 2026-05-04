'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import HRLayout from '@/components/hr/Layout';
import { formatDate } from '@/utils/formatDate';
import { Modal } from '@/components/superadmin/Modal';
import { CreateUserForm, CreateUserFormValues } from '@/components/superadmin/CreateUserForm';
import { useHREmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks/hr/useHREmployees';
import type { Employee } from '@/types/hr';

export default function HREmployeesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const itemsPerPage = 10;

  // Use hooks instead of direct fetch
  const employeesQuery = useHREmployees();
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const isLoading = employeesQuery.isLoading;
  const error = employeesQuery.error;

  // Edit form
  const editForm = useFormik({
    initialValues: {
      name: editingEmployee?.name || '',
      email: editingEmployee?.email || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
      email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      if (editingEmployee) {
        updateMutation.mutate({ id: editingEmployee.id, payload: values });
      }
    },
  });

  // Support both paginated responses and plain array responses
  const raw = employeesQuery.data as any;
  const employees: Employee[] = Array.isArray(raw)
    ? raw
    : raw?.data?.employees ?? raw?.employees ?? [];

  const total: number = Array.isArray(raw)
    ? employees.length
    : typeof raw?.data?.total === 'number'
    ? raw.data.total
    : typeof raw?.total === 'number'
    ? raw.total
    : employees.length;

  const totalPages = total ? Math.ceil(total / itemsPerPage) : 0;
  const paginatedEmployees = employees.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleCreateEmployee = async (values: CreateUserFormValues) => {
    await createMutation.mutateAsync({
      name: values.name,
      email: values.email,
      role: 'employee',
    } as any);
    setIsCreateOpen(false);
  };

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Employees</h2>
            <p className="text-gray-600 mt-1">Manage employee records</p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-create-action font-medium px-4 py-2 transition-colors"
          >
            + Add Employee
          </button>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Failed to load employees. Please try again.</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Employees table */}
        {!isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(employee.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingEmployee(employee);
                          setIsEditOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(employee.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {total === 0 ? 0 : (page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      page === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(page + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}

        {/* Create Modal */}
        <Modal isOpen={isCreateOpen} title="Add New Employee" onClose={() => setIsCreateOpen(false)}>
          <CreateUserForm
            submitLabel={createMutation.isPending ? 'Creating...' : 'Create Employee'}
            lockedRole="employee"
            initialRole="employee"
            onSubmit={handleCreateEmployee}
            onCancel={() => setIsCreateOpen(false)}
          />
        </Modal>

        {/* Edit Modal */}
        {isEditOpen && editingEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Employee</h3>
              <form onSubmit={editForm.handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    {...editForm.getFieldProps('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {editForm.touched.name && editForm.errors.name && (
                    <p className="text-red-600 text-sm mt-1">{editForm.errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    {...editForm.getFieldProps('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {editForm.touched.email && editForm.errors.email && (
                    <p className="text-red-600 text-sm mt-1">{editForm.errors.email}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditingEmployee(null);
                      editForm.resetForm();
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Employee?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this employee? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => deleteMutation.mutate(deleteConfirm)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRLayout>
  );
}
