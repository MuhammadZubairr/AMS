'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HRSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/hr',
      icon: '📊',
    },
    {
      name: 'Employees',
      href: '/hr/employees',
      icon: '👥',
    },
    {
      name: 'Attendance',
      href: '/hr/attendance',
      icon: '📋',
    },
    {
      name: 'Reports',
      href: '/hr/reports',
      icon: '📈',
    },
    {
      name: 'Leave Approvals',
      href: '/hr/leaves',
      icon: '✓',
    },
    {
      name: 'Profile',
      href: '/hr/profile',
      icon: '👤',
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white z-40 transition-transform duration-300 transform md:translate-x-0 w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="p-6 border-b border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-blue-900">
                HR
              </div>
              <div>
                <h1 className="text-xl font-bold">DevFlx HR</h1>
                <p className="text-xs text-blue-200">Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={onClose}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-blue-700">
            <button
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">{isLogoutLoading ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile spacing */}
      <div className="md:hidden"></div>
    </>
  );
}
