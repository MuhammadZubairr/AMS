/**
 * Super Admin Layout Wrapper
 * Combines Sidebar and Navbar
 */

'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function SuperAdminLayout({ children, title = 'Dashboard' }: SuperAdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900">
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      <Sidebar collapsed={isSidebarCollapsed} mobileOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      <div className={`transition-[padding-left] duration-300 ease-in-out ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
        <Navbar
          title={title}
          sidebarCollapsed={isSidebarCollapsed}
          onMobileMenuClick={() => setIsMobileSidebarOpen(true)}
          onCollapseToggle={() => setIsSidebarCollapsed((value) => !value)}
        />

        <main className="pb-8 pt-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

