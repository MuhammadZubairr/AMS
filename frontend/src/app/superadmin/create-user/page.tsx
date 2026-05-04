'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { CreateUserForm, CreateUserFormValues } from '@/components/superadmin/CreateUserForm';

export default function CreateUserPage() {
  const router = useRouter();
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const handleCreateUser = async (values: CreateUserFormValues) => {
    try {
      // TODO: Connect to actual API endpoint
      console.log('Creating user:', values);
      setNotification({ type: 'success', message: 'User created successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to create user. Please try again.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <SuperAdminLayout title="Create User">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Notification */}
        {notification && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New User</h1>
          <p className="mt-2 text-sm text-slate-600">
            Add a new user to the system. Choose their role and assign them to a department.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <CreateUserForm
            submitLabel="Create User"
            onSubmit={handleCreateUser}
            onCancel={() => router.push('/superadmin/users')}
          />
        </div>
      </div>
    </SuperAdminLayout>
  );
}
