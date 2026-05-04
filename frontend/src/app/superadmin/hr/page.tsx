/**
 * HR Management Page
 */

'use client';

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { DataTable, TableColumn } from '@/components/superadmin/DataTable';
import { Modal } from '@/components/superadmin/Modal';
import { Badge } from '@/components/superadmin/Badge';
import { LoadingState, ErrorState, EmptyState } from '@/components/superadmin/States';
import { DeleteConfirmation } from '@/components/superadmin/DeleteConfirmation';
import { useHRUsers, useCreateHR, useDeleteUser } from '@/hooks/useSuperAdmin';
import { User } from '@/types/superadmin';
import { formatDate } from '@/utils/formatDate';
import ActionMenu from '@/components/superadmin/ActionMenu';
import { CreateUserForm, CreateUserFormValues } from '@/components/superadmin/CreateUserForm';

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

  const handleCreateHR = async (values: CreateUserFormValues) => {
    try {
      const response = await createMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });
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
      render: (value) => formatDate(value as any),
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
            className="btn-create-action px-6 py-2 transition-colors font-medium"
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
                <ActionMenu
                  items={[{ label: 'Delete', onClick: () => setDeleteConfirm({ open: true, user }), accent: 'danger' }]}
                />
              )}
            />
          </div>
        )}

        {/* Create HR Modal */}
        <Modal isOpen={isModalOpen} title="Create HR User" onClose={() => setIsModalOpen(false)}>
          <CreateUserForm
            submitLabel="Create HR User"
            lockedRole="hr"
            initialRole="hr"
            onSubmit={handleCreateHR}
            onCancel={() => setIsModalOpen(false)}
          />
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
