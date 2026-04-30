/**
 * Super Admin Sidebar Navigation
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { SIDEBAR_MENU } from '@/constants/superadmin';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-blue-600">DevFlx</h1>
        <p className="text-xs text-gray-500 mt-1">Super Admin</p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {SIDEBAR_MENU.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
