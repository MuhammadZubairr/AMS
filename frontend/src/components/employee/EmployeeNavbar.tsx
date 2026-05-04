'use client';

import BrandLogo from '../BrandLogo';
import Logout from '../Logout';
import type { EmployeeNavbarProps } from '@/types/components';
import { ROUTES } from '@/constants/routes';

/**
 * Employee Navbar Component
 * Primary navigation header for employee dashboard with quick access links
 * Fully responsive with mobile-first design
 */
export default function EmployeeNavbar({ employeeName = 'Employee' }: EmployeeNavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-blue-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo subtitle="Attendance Management" />
          <span className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 lg:inline-flex">
            {employeeName}
          </span>
        </div>
        <nav className="flex w-full items-center gap-2 overflow-x-auto pb-1 text-sm font-medium text-slate-600 sm:gap-3 lg:w-auto lg:flex-wrap lg:justify-end">
          <a
            href={ROUTES.EMPLOYEE.DASHBOARD}
            className="shrink-0 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700"
          >
            Dashboard
          </a>
          <a
            href={ROUTES.EMPLOYEE.MY_ATTENDANCE}
            className="shrink-0 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700"
          >
            My Attendance
          </a>
          <a
            href={ROUTES.EMPLOYEE.LEAVE_REQUESTS}
            className="shrink-0 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700"
          >
            Leaves
          </a>
          <a
            href={ROUTES.EMPLOYEE.PROFILE}
            className="shrink-0 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700"
          >
            Profile
          </a>
          <div className="shrink-0 pl-1">
            <Logout />
          </div>
        </nav>
      </div>
    </header>
  );
}
