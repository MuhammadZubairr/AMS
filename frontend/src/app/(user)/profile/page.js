'use client';

import { useEffect, useState } from 'react';
import EmployeeLayout from '@/components/employee/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load profile');
        }
        setUser(data.user || null);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <EmployeeLayout title="Profile">
      <div className="rounded-2xl border border-blue-100 bg-white p-5">
        {loading && <p className="text-sm text-slate-600">Loading profile...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && user && (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Name</p>
              <p className="text-lg font-semibold text-slate-900">{user.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Email</p>
              <p className="text-base text-slate-800">{user.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Role</p>
              <p className="text-base text-blue-700">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
