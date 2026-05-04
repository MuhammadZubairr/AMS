/**
 * Users Management Page
 * View, filter, search, and manage all users with pagination
 */

'use client';

import { UserManagementBoard } from '@/components/superadmin/UserManagementBoard';

export default function UsersPage() {
  return (
    <UserManagementBoard
      title="User Management"
      subtitle="Manage managers, HR, and employees from one place."
      defaultRole="manager"
      showTabs
    />
  );
}
