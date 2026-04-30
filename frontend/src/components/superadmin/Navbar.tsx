/**
 * Super Admin Navbar/Header Component
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function Navbar({
  sidebarOpen = false,
  setSidebarOpen = () => {},
}: {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}) {
  const router = useRouter();
  const { user, logout } = useAuth() as {
    user: { name?: string; role?: string } | null;
    logout: () => Promise<void>;
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 md:left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      {/* Left side - could add breadcrumbs here */}
      <div className="flex items-center space-x-4"></div>

      {/* Right side - User menu */}
      <div className="flex items-center space-x-4 relative">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-lg"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
              <button
                onClick={() => {
                  router.push('/superadmin/settings');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  router.push('/superadmin/profile');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
