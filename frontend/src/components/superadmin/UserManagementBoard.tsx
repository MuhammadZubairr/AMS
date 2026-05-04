'use client';

import React from 'react';
import { DataTable } from './DataTable';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { DeleteConfirmation } from './DeleteConfirmation';
import { SuperAdminLayout } from './Layout';
import { SuperAdminIcon } from './Icon';
import ActionMenu from './ActionMenu';
import { ROLE_OPTIONS } from '@/constants/superadmin';
import { formatDate } from '@/utils/formatDate';
import { managedUsers } from './mockData';
import type { ManagedUser, UserRole } from '@/types/superadmin';

type FilterRole = UserRole | 'all';

interface UserManagementBoardProps {
  title: string;
  subtitle: string;
  defaultRole?: FilterRole;
  showTabs?: boolean;
}

const tabs: Array<{ label: string; value: FilterRole }> = [
  { label: 'Managers', value: 'manager' },
  { label: 'HR', value: 'hr' },
  { label: 'Employees', value: 'employee' },
];

function roleBadge(role: ManagedUser['role']) {
  if (role === 'manager') return 'info';
  if (role === 'hr') return 'success';
  if (role === 'employee') return 'primary';
  return 'danger';
}

export function UserManagementBoard({ title, subtitle, defaultRole = 'manager', showTabs = true }: UserManagementBoardProps) {
  const [activeRole, setActiveRole] = React.useState<FilterRole>(defaultRole === 'all' ? 'manager' : defaultRole);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'suspended'>('all');
  const [users, setUsers] = React.useState<ManagedUser[]>(managedUsers);
  const [editingUser, setEditingUser] = React.useState<ManagedUser | null>(null);
  const [draftUser, setDraftUser] = React.useState<ManagedUser | null>(null);
  const [deleteUser, setDeleteUser] = React.useState<ManagedUser | null>(null);
  const [banner, setBanner] = React.useState<{ type: 'success' | 'info'; message: string } | null>(null);

  React.useEffect(() => {
    if (editingUser) {
      setDraftUser({ ...editingUser });
    }
  }, [editingUser]);

  React.useEffect(() => {
    if (!banner) return;

    const timer = setTimeout(() => setBanner(null), 3000);
    return () => clearTimeout(timer);
  }, [banner]);

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const matchesRole = showTabs ? user.role === activeRole : defaultRole === 'all' || user.role === defaultRole;
      const matchesSearch =
        !searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesRole && matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [activeRole, defaultRole, departmentFilter, searchQuery, showTabs, statusFilter, users]);

  const departmentOptions = React.useMemo(() => {
    const values = Array.from(new Set(users.map((user) => user.department).filter(Boolean)));
    return values as string[];
  }, [users]);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draftUser) return;

    setUsers((current) => current.map((user) => (user.id === draftUser.id ? draftUser : user)));
    setEditingUser(null);
    setDraftUser(null);
    setBanner({ type: 'success', message: `${draftUser.name} updated successfully.` });
  };

  const handleDelete = () => {
    if (!deleteUser) return;

    setUsers((current) => current.filter((user) => user.id !== deleteUser.id));
    setDeleteUser(null);
    setBanner({ type: 'info', message: `${deleteUser.name} deleted from the list.` });
  };

  const handleSuspend = (user: ManagedUser) => {
    setUsers((current) =>
      current.map((entry) =>
        entry.id === user.id ? { ...entry, status: entry.status === 'suspended' ? 'active' : 'suspended' } : entry
      )
    );

    setBanner({
      type: 'success',
      message: `${user.name} ${user.status === 'suspended' ? 'reactivated' : 'suspended'} successfully.`,
    });
  };

  const handleResetPassword = (user: ManagedUser) => {
    setBanner({ type: 'info', message: `Password reset link prepared for ${user.email}.` });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value: ManagedUser['role']) => <Badge label={ROLE_OPTIONS[value]} variant={roleBadge(value)} size="sm" />,
    },
    {
      key: 'createdByLabel',
      label: 'Created By',
      render: (_: string, item: ManagedUser) => item.createdByLabel || 'Super Admin',
    },
    {
      key: 'created_at',
      label: 'Created Date',
      render: (value: string) => formatDate(value),
    },
  ];

  return (
    <SuperAdminLayout title={title}>
      <div className="space-y-6">
        {banner && (
          <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${banner.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
            {banner.message}
          </div>
        )}

        <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 p-6 text-white shadow-xl shadow-blue-600/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Super Admin Console</p>
              <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm text-blue-50/90">{subtitle}</p>
            </div>
            <a
              href="/superadmin/create-user"
              className="btn-create-action inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold"
            >
              <SuperAdminIcon name="users" className="h-4 w-4" />
              Create User
            </a>
          </div>
        </section>

        {showTabs && (
          <div className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
            {tabs.map((tab) => {
              const isActive = activeRole === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveRole(tab.value)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <SuperAdminIcon name="search" className="h-5 w-5 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name or email"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>

            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            >
              <option value="all">All Departments</option>
              {departmentOptions.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | 'active' | 'suspended')}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </section>

        <DataTable
          columns={columns}
          data={filteredUsers}
          actions={(user) => (
            <ActionMenu
              items={[
                { label: 'Edit', onClick: () => setEditingUser(user), accent: 'primary' },
                { label: user.status === 'suspended' ? 'Reactivate' : 'Suspend', onClick: () => handleSuspend(user), accent: 'neutral' },
                { label: 'Reset Password', onClick: () => handleResetPassword(user), accent: 'primary' },
                { label: 'Delete', onClick: () => setDeleteUser(user), accent: 'danger' },
              ]}
            />
          )}
        />

        <div className="grid gap-4 md:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <Badge label={ROLE_OPTIONS[user.role]} variant={roleBadge(user.role)} size="sm" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Created By</p>
                  <p className="mt-1 font-medium text-slate-800">{user.createdByLabel || 'Super Admin'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Created Date</p>
                  <p className="mt-1 font-medium text-slate-800">{formatDate(user.created_at)}</p>
                </div>
              </div>

              <div className="mt-4">
                <ActionMenu
                  items={[
                    { label: 'Edit', onClick: () => setEditingUser(user), accent: 'primary' },
                    { label: user.status === 'suspended' ? 'Reactivate' : 'Suspend', onClick: () => handleSuspend(user), accent: 'neutral' },
                    { label: 'Reset Password', onClick: () => handleResetPassword(user), accent: 'primary' },
                    { label: 'Delete', onClick: () => setDeleteUser(user), accent: 'danger' },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!editingUser && !!draftUser}
        title="Edit User"
        onClose={() => {
          setEditingUser(null);
          setDraftUser(null);
        }}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setDraftUser(null);
              }}
              className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-user-form"
              className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>
          </>
        }
      >
        {draftUser && (
          <form id="edit-user-form" onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Full Name</span>
              <input
                value={draftUser.name}
                onChange={(event) => setDraftUser({ ...draftUser, name: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </label>
            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                value={draftUser.email}
                onChange={(event) => setDraftUser({ ...draftUser, email: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </label>
            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select
                value={draftUser.role}
                onChange={(event) => setDraftUser({ ...draftUser, role: event.target.value as UserRole })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="manager">Manager</option>
                <option value="hr">HR</option>
                <option value="employee">Employee</option>
              </select>
            </label>
            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Department</span>
              <input
                value={draftUser.department || ''}
                onChange={(event) => setDraftUser({ ...draftUser, department: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </label>
            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Phone</span>
              <input
                value={draftUser.phone || ''}
                onChange={(event) => setDraftUser({ ...draftUser, phone: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </label>
            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select
                value={draftUser.status || 'active'}
                onChange={(event) => setDraftUser({ ...draftUser, status: event.target.value as 'active' | 'suspended' })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
          </form>
        )}
      </Modal>

      <DeleteConfirmation
        isOpen={!!deleteUser}
        title="Delete User"
        message="This will permanently remove the selected user from the dashboard list."
        itemName={deleteUser?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteUser(null)}
      />
    </SuperAdminLayout>
  );
}