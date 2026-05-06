'use client';

import { useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import HRSidebar from './Sidebar';
import { SuperAdminIcon } from '@/components/superadmin/Icon';
import { useAuth } from '@/hooks/useAuth';

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Derive page title from pathname
  const pageTitle = (() => {
    if (!pathname) return 'HR Management System';
    if (pathname.startsWith('/hr/dashboard') || pathname === '/hr') return 'Dashboard';
    if (pathname.startsWith('/hr/employees')) return 'Employees';
    if (pathname.startsWith('/hr/attendance')) return 'Attendance';
    if (pathname.startsWith('/hr/leaves')) return 'Leave Approvals';
    if (pathname.startsWith('/hr/reports')) return 'Reports';
    if (pathname.startsWith('/hr/profile')) return 'Profile';
    return 'HR Management System';
  })();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <HRSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        collapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-[margin] duration-300 ease-in-out ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        {/* Top navbar (64px height) */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-20 h-16">
          <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Hamburger menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                aria-label="Open sidebar"
              >
                <SuperAdminIcon name="menu" className="h-6 w-6" />
              </button>

              {/* Page title */}
              <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
            </div>

            {/* Right side: notifications, avatar, dropdown */}
            <div className="flex items-center gap-4">
              <button
                className="relative p-2 rounded-md hover:bg-gray-100"
                aria-label="Notifications"
              >
                <SuperAdminIcon name="bell" className="h-5 w-5 text-slate-600" />
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-rose-500 text-white text-xs">3</span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 rounded-full hover:bg-gray-100 px-2 py-1"
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                >
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">HR</div>
                  <svg className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30">
                    <a href="/hr/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">My Profile</a>
                    <a href="/hr/change-password" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Change Password</a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
