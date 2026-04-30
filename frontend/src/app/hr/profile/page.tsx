'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import HRLayout from '@/components/hr/Layout';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface ProfileResponse {
  user: UserProfile;
}

export default function HRProfilePage() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const { data: profile, isLoading, error } = useQuery<ProfileResponse>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setPasswordMessage(error.error || error.message || 'Failed to change password');
        return;
      }

      setPasswordMessage('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setPasswordMessage('');
      }, 2000);
    } catch (err) {
      setPasswordMessage('An error occurred');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (error) {
    return (
      <HRLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Failed to load profile. Please try again.</p>
        </div>
      </HRLayout>
    );
  }

  if (isLoading) {
    return (
      <HRLayout>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
          <p className="text-gray-600 mt-1">View and manage your account</p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {profile?.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{profile?.user?.name}</h3>
                <p className="text-gray-600">{profile?.user?.email}</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
              {profile?.user?.role}
            </span>
          </div>

          {/* Profile details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Full Name</p>
              <p className="text-lg text-gray-900 mt-1">{profile?.user?.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Email Address</p>
              <p className="text-lg text-gray-900 mt-1">{profile?.user?.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Role</p>
              <p className="text-lg text-gray-900 mt-1 capitalize">{profile?.user?.role}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Member Since</p>
              <p className="text-lg text-gray-900 mt-1">
                {profile?.user?.created_at
                  ? new Date(profile.user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
          </div>

          {/* Change password button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-600">
            <p className="text-sm font-medium text-gray-700">Account Status</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">Active</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-600">
            <p className="text-sm font-medium text-gray-700">Access Level</p>
            <p className="text-2xl font-bold text-green-600 mt-2">HR Manager</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-l-4 border-purple-600">
            <p className="text-sm font-medium text-gray-700">System Role</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">{profile?.user?.role}</p>
          </div>
        </div>
      </div>

      {/* Change password modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {passwordMessage && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    passwordMessage.includes('success')
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {passwordMessage}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordMessage('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRLayout>
  );
}
