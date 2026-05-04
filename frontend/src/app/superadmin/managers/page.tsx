/**
 * Managers Management Page
 * View, create, edit, and delete managers with full CRUD operations
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { DataTable, TableColumn } from '@/components/superadmin/DataTable';
import ActionMenu from '@/components/superadmin/ActionMenu';
import { Modal } from '@/components/superadmin/Modal';
import { formatDate } from '@/utils/formatDate';
import { CreateUserForm, CreateUserFormValues } from '@/components/superadmin/CreateUserForm';
import { FormField } from '@/components/superadmin/FormFields';
import { LoadingState, ErrorState, EmptyState } from '@/components/superadmin/States';
import { DeleteConfirmation } from '@/components/superadmin/DeleteConfirmation';
import { useManagers, useCreateManager, useDeleteUser } from '@/hooks/useSuperAdmin';
import { updateManager } from '@/services/superadminApi';
import { User } from '@/types/superadmin';
import * as yup from 'yup';

const MANAGERS_PER_PAGE = 10;

// Validation schema for edit manager
const editManagerSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

export default function ManagersPage() {
  const queryClient = useQueryClient();
  const createMutation = useCreateManager(queryClient);
  const deleteMutation = useDeleteUser(queryClient);

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editManager, setEditManager] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  // Fetch managers with pagination
  const offset = (currentPage - 1) * MANAGERS_PER_PAGE;
  const { data, isLoading, error } = useManagers(MANAGERS_PER_PAGE, offset);

  const managers = data?.users || [];
  const totalManagers = data?.total || 0;
  const totalPages = Math.ceil(totalManagers / MANAGERS_PER_PAGE);

  // Filter managers based on search
  const filteredManagers = useMemo(() => {
    return managers.filter((manager: User) => {
      const matchesSearch =
        !searchQuery ||
        manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manager.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [managers, searchQuery]);

  // Auto-hide notification after 3 seconds
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCreateManager = async (values: CreateUserFormValues) => {
    try {
      const response = await createMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (response.ok) {
        setNotification({
          type: 'success',
          message: `Manager ${values.email} created successfully`,
        });
        setIsCreateModalOpen(false);
      } else {
        setNotification({
          type: 'error',
          message: response.error || 'Failed to create manager',
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create manager',
      });
    }
  };

  const handleUpdateManager = async (values: { name: string; email: string }) => {
    if (!editManager) return;

    setIsUpdating(true);
    try {
      const response = await updateManager(editManager.id, values);

      if (response.ok) {
        setNotification({
          type: 'success',
          message: `Manager updated successfully`,
        });

        // Refresh managers list
        queryClient.invalidateQueries({ queryKey: ['superadmin', 'managers'] });

        // Close modal after 500ms to show notification
        setTimeout(() => {
          setEditManager(null);
        }, 500);
      } else {
        setNotification({
          type: 'error',
          message: response.error || 'Failed to update manager',
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update manager',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.user) {
      try {
        await deleteMutation.mutateAsync(deleteConfirm.user.id);
        setNotification({
          type: 'success',
          message: `Manager deleted successfully`,
        });
        setDeleteConfirm({ open: false, user: null });
      } catch (err) {
        setNotification({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to delete manager',
        });
      }
    }
  };

  const columns: TableColumn<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => formatDate(value as any),
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
        <ErrorState message="Failed to load managers" />
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Managers</h1>
              <p className="text-gray-600 mt-1">Showing {filteredManagers.length} of {totalManagers} managers</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-create-action px-6 py-2 transition-colors font-medium"
            >
              ➕ Add Manager
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Managers
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Search is performed on the client side</p>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          {filteredManagers.length === 0 ? (
            <EmptyState title="No Managers Found" message="Try adjusting your search" />
          ) : (
            <div>
              <DataTable
                columns={columns}
                data={filteredManagers}
                actions={(manager) => (
                  <ActionMenu
                    items={[
                      { label: 'Edit', onClick: () => setEditManager(manager), accent: 'primary' },
                      { label: 'Delete', onClick: () => setDeleteConfirm({ open: true, user: manager }), accent: 'danger' },
                    ]}
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredManagers.length ===  0 ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-gray-500">No managers found</p>
            </div>
          ) : (
            filteredManagers.map((manager: User) =>  (
              <div key={manager.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="space-y-3">
                  {/* Name */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                    <p className="font-semibold text-gray-900">{manager.name}</p>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-gray-700 break-all text-sm">{manager.email}</p>
                  </div>

                  {/* Created Date */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                    <p className="text-gray-700 text-sm">{formatDate(manager.created_at)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-2">
                    <ActionMenu
                      items={[
                        { label: 'Edit', onClick: () => setEditManager(manager), accent: 'primary' },
                        { label: 'Delete', onClick: () => setDeleteConfirm({ open: true, user: manager }), accent: 'danger' },
                      ]}
                    />
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
              Page {currentPage} of {totalPages} ({totalManagers} total managers)
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
                        currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

        {/* Create Manager Modal */}
        {isCreateModalOpen && (
          <Modal isOpen={isCreateModalOpen} title="Create Manager" onClose={() => setIsCreateModalOpen(false)}>
              <CreateUserForm
                submitLabel="Create Manager"
                lockedRole="manager"
                initialRole="manager"
                onSubmit={handleCreateManager}
                onCancel={() => setIsCreateModalOpen(false)}
              />
          </Modal>
        )}

        {/* Edit Manager Modal */}
        {editManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit Manager</h2>
                  <p className="text-sm text-gray-600 mt-1">{editManager.email}</p>
                </div>
                <button
                  onClick={() => setEditManager(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <Formik
                initialValues={{
                  name: editManager.name,
                  email: editManager.email,
                }}
                validationSchema={editManagerSchema}
                onSubmit={handleUpdateManager}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="p-6 space-y-4">
                      <FormField
                        name="name"
                        label="Full Name"
                        placeholder="John Doe"
                        error={errors.name}
                        touched={touched.name}
                      />
                      <FormField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        error={errors.email}
                        touched={touched.email}
                      />
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setEditManager(null)}
                        disabled={isUpdating}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {isUpdating ? 'Updating...' : 'Update Manager'}
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
          title="Delete Manager"
          message="Are you sure you want to delete this manager?"
          itemName={deleteConfirm.user?.email}
          isLoading={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ open: false, user: null })}
        />
      </div>
    </SuperAdminLayout>
  );
}
