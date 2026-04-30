'use client';

import { useQuery } from '@tanstack/react-query';
import HRLayout from '@/components/hr/Layout';

interface DashboardStats {
  total_employees: number;
  present_today: number;
  absent_today: number;
  late_today: number;
  pending_leaves: number;
}

export default function HRDashboard() {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['hrDashboard'],
    queryFn: async () => {
      const response = await fetch('/api/hr/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.total_employees || 0,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Present Today',
      value: stats?.present_today || 0,
      icon: '✅',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Absent Today',
      value: stats?.absent_today || 0,
      icon: '❌',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      title: 'Late Today',
      value: stats?.late_today || 0,
      icon: '⏰',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      title: 'Pending Leaves',
      value: stats?.pending_leaves || 0,
      icon: '📋',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  return (
    <HRLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-2">Welcome to HR Management System</p>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Failed to load dashboard data. Please try again.</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
            ))}
          </div>
        )}

        {/* Stat cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statCards.map((card) => (
              <div
                key={card.title}
                className={`${card.bgColor} rounded-lg p-6 border-l-4 border-b-4`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm font-medium ${card.textColor}`}>{card.title}</p>
                    <p className={`text-3xl font-bold ${card.textColor} mt-2`}>{card.value}</p>
                  </div>
                  <span className="text-4xl">{card.icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/hr/employees"
              className="block p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <p className="font-medium text-blue-900">👥 Manage Employees</p>
              <p className="text-sm text-blue-700 mt-1">View and manage employee records</p>
            </a>
            <a
              href="/hr/leaves"
              className="block p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
            >
              <p className="font-medium text-purple-900">📋 Approve Leaves</p>
              <p className="text-sm text-purple-700 mt-1">Review pending leave requests</p>
            </a>
            <a
              href="/hr/attendance"
              className="block p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-200"
            >
              <p className="font-medium text-green-900">📊 View Attendance</p>
              <p className="text-sm text-green-700 mt-1">Check attendance records</p>
            </a>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
