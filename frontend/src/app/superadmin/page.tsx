/**
 * Super Admin Dashboard Page
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { StatCard } from '@/components/superadmin/StatCard';
import { LoadingState, ErrorState } from '@/components/superadmin/States';
import { useDashboard } from '@/hooks/useSuperAdmin';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: dashboard, isLoading, error } = useDashboard();

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
          message="Failed to load dashboard data"
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['superadmin', 'dashboard'] })}
        />
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your system overview.</p>
        </div>

        {/* Stat Cards Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <StatCard
            title="Total Users"
            value={dashboard?.totalUsers || 0}
            icon="👥"
            color="blue"
            onClick={() => router.push('/superadmin/users')}
          />

          {/* Managers */}
          <StatCard
            title="Managers"
            value={dashboard?.breakdown?.managers || 0}
            icon="👔"
            color="purple"
            onClick={() => router.push('/superadmin/managers')}
          />

          {/* HR */}
          <StatCard
            title="HR Users"
            value={dashboard?.breakdown?.hr || 0}
            icon="📋"
            color="green"
            onClick={() => router.push('/superadmin/hr')}
          />

          {/* Employees */}
          <StatCard
            title="Employees"
            value={dashboard?.breakdown?.employees || 0}
            icon="👨‍💼"
            color="yellow"
            onClick={() => router.push('/superadmin/employees')}
          />

          {/* Today's Attendance */}
          <StatCard
            title="Today's Attendance"
            value={dashboard?.attendance?.todayCount || 0}
            icon="✅"
            color="green"
            onClick={() => router.push('/superadmin/attendance')}
          />

          {/* Absent Today */}
          <StatCard
            title="Absent Today"
            value={dashboard?.attendance?.absentCount || 0}
            icon="❌"
            color="red"
            onClick={() => router.push('/superadmin/attendance')}
          />

          </div>
        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/superadmin/managers/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ➕ Add Manager
            </button>
            <button
              onClick={() => router.push('/superadmin/hr/create')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              ➕ Add HR
            </button>
            <button
              onClick={() => router.push('/superadmin/users')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              👥 View All Users
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">System Status</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✅ Backend: Connected</p>
              <p>✅ Database: Active</p>
              <p>✅ Authentication: Ready</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">User Count Breakdown</h3>
            <div className="space-y-2 text-sm">
              <p className="text-blue-600">Super Admins: {dashboard?.breakdown?.superadmins || 0}</p>
              <p className="text-purple-600">Managers: {dashboard?.breakdown?.managers || 0}</p>
              <p className="text-green-600">HR: {dashboard?.breakdown?.hr || 0}</p>
              <p className="text-yellow-600">Employees: {dashboard?.breakdown?.employees || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
