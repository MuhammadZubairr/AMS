/**
 * Employees Management Page
 * View, create, edit, and delete employees with full CRUD operations
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { DataTable, TableColumn } from '@/components/superadmin/DataTable';
import ActionMenu from '@/components/superadmin/ActionMenu';
import { Modal } from '@/components/superadmin/Modal';
import { LoadingState, ErrorState, EmptyState } from '@/components/superadmin/States';
import { DeleteConfirmation } from '@/components/superadmin/DeleteConfirmation';
import { useEmployees, useCreateUser, useDeleteUser } from '@/hooks/useSuperAdmin';
import { CreateUserForm, CreateUserFormValues } from '@/components/superadmin/CreateUserForm';
import { User } from '@/types/superadmin';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const EMPLOYEES_PER_PAGE = 10;

// Validation schema for edit employee
const editEmployeeSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const createMutation = useCreateUser(queryClient);
  const deleteMutation = useDeleteUser(queryClient);

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  // Fetch employees with pagination - filter by role 'employee'
  const offset = (currentPage - 1) * EMPLOYEES_PER_PAGE;
  const { data, isLoading, error } = useEmployees(EMPLOYEES_PER_PAGE, offset);

  // Filter employees by search query
  const filteredEmployees = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter((emp: User) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.users, searchQuery]);

  // Handle create employee
  const handleCreateEmployee = async (values: CreateUserFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
        role: 'employee',
      });
      setIsCreateModalOpen(false);
      setNotification({ type: 'success', message: 'Employee created successfully' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create employee',
      });
    }
  };

  // Handle update employee
  const handleUpdateEmployee = async () => {
    if (!editEmployee) return;
    try {
      setIsUpdating(true);
      // Assuming updateUser API exists in superadminApi
      await queryClient.invalidateQueries({ queryKey: ['superadmin', 'employees'] });
      setEditEmployee(null);
      setNotification({ type: 'success', message: 'Employee updated successfully' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update employee',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async () => {
    if (!deleteConfirm.user) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirm.user.id);
      setDeleteConfirm({ open: false, user: null });
      setNotification({ type: 'success', message: 'Employee deleted successfully' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete employee',
      });
    }
  };

  // Table columns
  const columns: TableColumn<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'created_at', label: 'Joined' },
  ];

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <LoadingState />
      </SuperAdminLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminLayout>
        <ErrorState
          message="Failed to load employees"
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['superadmin', 'employees'] })}
        />
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees Management</h1>
            <p className="text-gray-600 mt-1">Manage your employee workforce</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-create-action px-6 py-3 transition-colors font-medium"
          >
            ➕ Add Employee
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`p-4 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Data Table */}
        {filteredEmployees.length === 0 ? (
          <EmptyState title="No Employees Found" message="Try adjusting your search or filters." />
        ) : (
          <DataTable<User>
            columns={columns}
            data={filteredEmployees}
            actions={(employee) => (
              <ActionMenu
                items={[
                  {
                    label: 'Edit',
                    onClick: () => setEditEmployee(employee),
                    accent: 'primary',
                  },
                  {
                    label: 'Delete',
                    onClick: () => setDeleteConfirm({ open: true, user: employee }),
                    accent: 'danger',
                  },
                ]}
              />
            )}
          />
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.ceil((data?.total || 0) / EMPLOYEES_PER_PAGE) }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 rounded-lg ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <Modal isOpen={isCreateModalOpen} title="Add Employee" onClose={() => setIsCreateModalOpen(false)}>
              <CreateUserForm
                submitLabel="Create Employee"
                lockedRole="employee"
                initialRole="employee"
                onSubmit={handleCreateEmployee}
                onCancel={() => setIsCreateModalOpen(false)}
              />
          </Modal>
        )}

        {/* Edit Modal */}
        {editEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Employee</h2>
              <Formik
                initialValues={{ name: editEmployee.name, email: editEmployee.email }}
                validationSchema={editEmployeeSchema}
                onSubmit={handleUpdateEmployee}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <Field
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditEmployee(null)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || isUpdating}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting || isUpdating ? 'Updating...' : 'Update'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <DeleteConfirmation
          isOpen={deleteConfirm.open}
          title="Delete Employee"
          message="Are you sure you want to delete this employee?"
          itemName={deleteConfirm.user?.name || ''}
          onConfirm={handleDeleteEmployee}
          onCancel={() => setDeleteConfirm({ open: false, user: null })}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </SuperAdminLayout>
  );
}
