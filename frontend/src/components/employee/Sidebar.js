'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Attendance', href: '/attendance' },
  { label: 'Leave Requests', href: '/leaves' },
  { label: 'Profile', href: '/profile' },
];

export default function EmployeeSidebar({ isOpen, onClose, onLogout }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-30 bg-slate-900/35 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-white shadow-xl transition-transform duration-200 md:translate-x-0 md:shadow-none md:border-r md:border-blue-100 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-blue-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">DevFlx</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">Employee</h2>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-4">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-blue-100 p-3">
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-base font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
