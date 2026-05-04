'use client';

import React, { useMemo, useState } from 'react';
import { SuperAdminLayout } from './Layout';
import { DataTable } from './DataTable';
import ActionMenu from './ActionMenu';
import { formatDate } from '@/utils/formatDate';
import { SuperAdminIcon } from './Icon';
import { managedUsers } from './mockData';
import type { ManagedUser, UserRole } from '@/types/superadmin';

const roleLabelMap: Record<UserRole, string> = {
  superadmin: 'Super Admin',
  manager: 'Manager',
  hr: 'HR',
  employee: 'Employee',
};

export function RolePeoplePage({ role, title, subtitle }: { role: Exclude<UserRole, 'superadmin'>; title: string; subtitle: string; }) {
  const [search, setSearch] = useState('');

  const items = useMemo(() => {
    return managedUsers.filter((user) => {
      const matchesRole = user.role === role;
      const matchesSearch = [user.name, user.email, user.department || '']
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [role, search]);

  return (
    <SuperAdminLayout title={title}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{roleLabelMap[role]}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
              <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <SuperAdminIcon name="users" className="h-4 w-4" />
              {items.length} records
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <SuperAdminIcon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, or department"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <DataTable
          data={items}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'department', label: 'Department', render: (value) => value || '-' },
            { key: 'createdByLabel', label: 'Created By', render: (value) => value || 'Super Admin' },
            {
              key: 'created_at',
              label: 'Created Date',
              render: (value) => formatDate(value as any),
            },
          ]}
          actions={(_: ManagedUser) => (
            <ActionMenu
              items={[
                { label: 'Edit', onClick: () => {}, accent: 'primary' },
                { label: 'Suspend', onClick: () => {}, accent: 'neutral' },
                { label: 'Reset Password', onClick: () => {}, accent: 'primary' },
              ]}
            />
          )}
        />
      </div>
    </SuperAdminLayout>
  );
}
