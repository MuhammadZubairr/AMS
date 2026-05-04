'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/manager/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Preparing your dashboard...</p>
        <p className="text-xs text-slate-500 mt-1">Loading team data</p>
      </div>
    </div>
  );
}