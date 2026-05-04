'use client';

import { useState } from 'react';
import HRLayout from '@/components/hr/Layout';
import { useHRLeaves, useApproveLeave, useRejectLeave } from '@/hooks/hr/useHRLeaves';

interface LeaveRequest {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function HRLeavesPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const { data, isLoading, error } = useHRLeaves();
  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();

  const filteredLeaves = (data || []).filter((leave) => {
    if (filter === 'all') return true;
    return leave.status === filter;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDays = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  };

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Leave Approvals</h2>
          <p className="text-gray-600 mt-1">Review and approve employee leave requests</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} {f !== 'all' && `(${filteredLeaves.length})`}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Failed to load leave requests. Please try again.</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Leave requests list */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{leave.user_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-600">Leave Type</p>
                          <p className="font-medium text-gray-900">{leave.leave_type}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium text-gray-900">
                            {calculateDays(leave.start_date, leave.end_date)} days
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-medium text-gray-900">
                            {leave.start_date
                              ? new Date(leave.start_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: '2-digit',
                                })
                              : '—'}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="font-medium text-gray-900">
                            {leave.end_date
                              ? new Date(leave.end_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: '2-digit',
                                })
                              : '—'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="text-gray-900 mt-1">{leave.reason}</p>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900">{leave.user_email}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    {leave.status === 'pending' && (
                      <div className="flex flex-col gap-2 md:flex-row">
                        <button
                          onClick={() => approveMutation.mutate(leave.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectMutation.mutate(leave.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">
                  {filter === 'pending'
                    ? 'No pending leave requests'
                    : `No ${filter} leave requests`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Approval Modal */}
        {selectedLeave && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {selectedLeave.status === 'pending' ? 'Review Leave Request' : 'Leave Details'}
              </h3>

              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                <p>
                  <span className="font-medium text-gray-900">Employee:</span>{' '}
                  <span className="text-gray-600">{selectedLeave.user_name}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Type:</span>{' '}
                  <span className="text-gray-600">{selectedLeave.leave_type}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Duration:</span>{' '}
                  <span className="text-gray-600">
                    {calculateDays(selectedLeave.start_date, selectedLeave.end_date)} days
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Period:</span>{' '}
                  <span className="text-gray-600">
                    {new Date(selectedLeave.start_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                    })}
                    {' - '}
                    {new Date(selectedLeave.end_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                    })}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Reason:</span>{' '}
                  <span className="text-gray-600">{selectedLeave.reason}</span>
                </p>
              </div>

              {selectedLeave.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => approveMutation.mutate(selectedLeave.id)}
                    disabled={approveMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {approveMutation.isPending ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(selectedLeave.id)}
                    disabled={rejectMutation.isPending}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedLeave(null)}
                className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </HRLayout>
  );
}
