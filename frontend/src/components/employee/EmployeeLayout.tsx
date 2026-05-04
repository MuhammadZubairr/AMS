'use client';

import EmployeeNavbar from './EmployeeNavbar';
import EmployeeSidebar from './EmployeeSidebar';
import type { LayoutProps } from '@/types/components';

/**
 * Employee Layout Component
 * Main layout wrapper for all employee dashboard pages
 * Combines responsive navbar and collapsible sidebar
 */
export default function EmployeeLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Navbar */}
      <EmployeeNavbar />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <EmployeeSidebar />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
