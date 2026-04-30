/**
 * HR Management Page
 */

'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { DataTable, TableColumn } from '@/components/superadmin/DataTable';
import { Modal } from '@/components/superadmin/Modal';
import { Badge } from '@/components/superadmin/Badge';
import { FormField, FormSubmit } from '@/components/superadmin/FormFields';
import { LoadingState, ErrorState, EmptyState } from '@/components/superadmin/States';
import { DeleteConfirmation } from '@/components/superadmin/DeleteConfirmation';
import { useHRUsers, useCreateHR, useDeleteUser } from '@/hooks/useSuperAdmin';
import { createHRSchema, CreateHRFormData } from '@/schemas/superadmin';
import { User } from '@/types/superadmin';

export default function HRPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useHRUsers();
  const createMutation = useCreateHR(queryClient);
  const deleteMutation = useDeleteUser(queryClient);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  const hrUsers = data?.users || [];

  const handleCreateHR = async (values: CreateHRFormData) => {
    try {
      const response = await createMutation.mutateAsync(values);
      if (response.ok) {
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error creating HR user:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.user) {
      try {
        await deleteMutation.mutateAsync(deleteConfirm.user.id);
        setDeleteConfirm({ open: false, user: null });
      } catch (err) {
        console.error('Error deleting HR user:', err);
      }
    }
  };

  const columns: TableColumn<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value) => <Badge label={String(value)} variant="success" />,
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => new Date(String(value)).toLocaleDateString(),
    },
  ];

  if (isLoading) return <SuperAdminLayout><LoadingState /></SuperAdminLayout>;
  if (error)
    return (
      <SuperAdminLayout>
        <ErrorState message="Failed to load HR users" />
      </SuperAdminLayout>
    );

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HR Management</h1>
            <p className="text-gray-600 mt-1">Total: {hrUsers.length} HR users</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ➕ Add HR
          </button>
        </div>

        {/* Table */}
        {hrUsers.length === 0 ? (
          <EmptyState
            title="No HR Users Yet"
            message="Create your first HR user to get started"
            actionLabel="Add HR"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <DataTable
              columns={columns}
              data={hrUsers}
              actions={(user) => (
                <button
                  onClick={() => setDeleteConfirm({ open: true, user })}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              )}
            />
          </div>
        )}

        {/* Create HR Modal */}
        <Modal isOpen={isModalOpen} title="Create HR User" onClose={() => setIsModalOpen(false)}>
          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={createHRSchema}
            onSubmit={handleCreateHR}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <FormField
                  name="name"
                  label="Full Name"
                  placeholder="Jane Doe"
                  error={errors.name}
                  touched={touched.name}
                />
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="jane@example.com"
                  error={errors.email}
                  touched={touched.email}
                />
                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                  error={errors.password}
                  touched={touched.password}
                />
                <FormSubmit label="Create HR User" isLoading={isSubmitting} />
              </Form>
            )}
          </Formik>
        </Modal>

        {/* Delete Confirmation */}
        <DeleteConfirmation
          isOpen={deleteConfirm.open}
          title="Delete HR User"
          message="Are you sure you want to delete this HR user?"
          itemName={deleteConfirm.user?.email}
          isLoading={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ open: false, user: null })}
        />
      </div>
    </SuperAdminLayout>
  );
}
