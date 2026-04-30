/**
 * Users Management Page
 * View, filter, search, and manage all users with pagination
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { DataTable, TableColumn } from '@/components/superadmin/DataTable';
import { Badge } from '@/components/superadmin/Badge';
import { FormField, FormSubmit } from '@/components/superadmin/FormFields';
import { LoadingState, ErrorState, EmptyState } from '@/components/superadmin/States';
import { DeleteConfirmation } from '@/components/superadmin/DeleteConfirmation';
import { Modal } from '@/components/superadmin/Modal';
import { useUsers, useDeleteUser, useCreateUser } from '@/hooks/useSuperAdmin';
import { updateUserRole } from '@/services/superadminApi';
import { ROLE_OPTIONS } from '@/constants/superadmin';
import { User } from '@/types/superadmin';
import { createUserSchema, CreateUserFormData } from '@/schemas/superadmin';
import * as yup from 'yup';

const USERS_PER_PAGE = 10;

// Validation schema for edit role
const editRoleSchema = yup.object({
  role: yup.string().oneOf(['manager', 'hr', 'employee'], 'Invalid role selected').required('Role is required'),
});

export default function UsersPage() {
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteUser(queryClient);

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const createMutation = useCreateUser(queryClient);

  // Fetch users with current filters
  const offset = (currentPage - 1) * USERS_PER_PAGE;
  const { data, isLoading, error } = useUsers(USERS_PER_PAGE, offset);

  const users = data?.users || [];
  const totalUsers = data?.total || 0;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const matchesSearch =
        !searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = !roleFilter || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Auto-hide notification after 3 seconds
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleUpdateUserRole = async (values: { role: string }) => {
    if (!editUser) return;
    
    setIsUpdating(true);
    try {
      const response = await updateUserRole(editUser.id, values);
      
      if (response.ok) {
        setNotification({
          type: 'success',
          message: `Role updated to ${values.role}`,
        });
        
        // Refresh user list
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
        
        // Close modal after 500ms to show notification
        setTimeout(() => {
          setEditUser(null);
        }, 500);
      } else {
        setNotification({
          type: 'error',
          message: response.error || 'Failed to update user role',
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update user',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.user) {
      try {
        await deleteMutation.mutateAsync(deleteConfirm.user.id);
        setDeleteConfirm({ open: false, user: null });
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleCreateUser = async (values: CreateUserFormData) => {
    try {
      const response = await createMutation.mutateAsync(values as any);
      if (response.ok) {
        setNotification({ type: 'success', message: 'User created successfully' });
        setIsCreateModalOpen(false);
      } else {
        setNotification({ type: 'error', message: response.error || 'Failed to create user' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: err instanceof Error ? err.message : 'Failed to create user' });
    }
  };

  const roleVariant = {
    superadmin: 'danger',
    manager: 'info',
    hr: 'success',
    employee: 'primary',
  } as const;

  const columns: TableColumn<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <Badge label={String(value)} variant={roleVariant[value as keyof typeof roleVariant] || 'primary'} />
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => new Date(String(value)).toLocaleDateString(),
    },
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
        <ErrorState message="Failed to load users" />
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Showing {filteredUsers.length} of {totalUsers} users</p>
          </div>
          <div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ➕ Create User
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Formik initialValues={{ search: '', role: '' }} onSubmit={() => {}}>
            {() => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Users
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Search is performed on the client side</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Role
                    </label>
                    <select
                      id="role-filter"
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1); // Reset to first page on filter
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Roles</option>
                      {Object.entries(ROLE_OPTIONS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setRoleFilter('');
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <EmptyState title="No Users Found" message="Try adjusting your search or filters" />
          ) : (
            <div>
              <DataTable
                columns={columns}
                data={filteredUsers}
                actions={(user) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditUser(user)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ open: true, user })}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              />
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            filteredUsers.map((user: User) => (
              <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="space-y-3">
                  {/* Name */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-gray-700 break-all text-sm">{user.email}</p>
                  </div>

                  {/* Role */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                    <Badge
                      label={user.role}
                      variant={roleVariant[user.role as keyof typeof roleVariant] || 'primary'}
                      size="sm"
                    />
                  </div>

                  {/* Created Date */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                    <p className="text-gray-700 text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setEditUser(user)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ open: true, user })}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({totalUsers} total users)
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Success/Error Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 animate-fade-in ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Create User Modal */}
        {isCreateModalOpen && (
          <Modal isOpen={isCreateModalOpen} title="Create User" onClose={() => setIsCreateModalOpen(false)}>
            <Formik
              initialValues={{ name: '', email: '', password: '', role: 'employee' }}
              validationSchema={createUserSchema}
              onSubmit={handleCreateUser}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <FormField name="name" label="Full Name" placeholder="John Doe" error={errors.name} touched={touched.name} />
                  <FormField name="email" label="Email" type="email" placeholder="john@example.com" error={errors.email} touched={touched.email} />
                  <FormField name="password" label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special" error={errors.password} touched={touched.password} />
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select id="role" name="role" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select a role</option>
                      {Object.entries(ROLE_OPTIONS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
                    <FormSubmit label="Create User" isLoading={isSubmitting} />
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>
        )}

        {/* Edit User Role Modal */}
        {editUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit User Role</h2>
                  <p className="text-sm text-gray-600 mt-1">{editUser.email}</p>
                </div>
                <button
                  onClick={() => setEditUser(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <Formik
                initialValues={{
                  role: editUser.role,
                }}
                validationSchema={editRoleSchema}
                onSubmit={handleUpdateUserRole}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form>
                    <div className="p-6 space-y-4">
                      {/* Current Role Info */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">CURRENT ROLE</p>
                        <p className="text-sm font-semibold text-blue-900 capitalize mt-1">{editUser.role}</p>
                      </div>

                      {/* Role Selection */}
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                          New Role <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={values.role}
                          onChange={(e) => setFieldValue('role', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.role && touched.role ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select a role</option>
                          {Object.entries(ROLE_OPTIONS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        {errors.role && touched.role && (
                          <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                        )}
                      </div>

                      {/* Role Change Impact Notice */}
                      {values.role && values.role !== editUser.role && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-700 font-medium">⚠ IMPORTANT</p>
                          <p className="text-xs text-yellow-700 mt-1">
                            Changing the role will give this user {values.role} permissions immediately.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setEditUser(null)}
                        disabled={isUpdating}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating || !values.role || values.role === editUser.role}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {isUpdating ? 'Updating...' : 'Update Role'}
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
          title="Delete User"
          message="Are you sure you want to delete this user?"
          itemName={deleteConfirm.user?.email}
          isLoading={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ open: false, user: null })}
        />
      </div>
    </SuperAdminLayout>
  );
}
