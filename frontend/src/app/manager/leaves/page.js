import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ManagerLayout from '@/components/ManagerLayout';
import { managerApi } from '@/services/managerApi';

export default function ManagerLeaves() {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: leavesData, isLoading, error } = useQuery({
    queryKey: ['manager-leaves'],
    queryFn: managerApi.getLeaveRequests,
  });

  const approveMutation = useMutation({
    mutationFn: (leaveId) => managerApi.approveLeave(leaveId),
    onSuccess: () => {
      queryClient.invalidateQueries(['manager-leaves']);
      setShowModal(false);
      setSelectedLeave(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (leaveId) => managerApi.rejectLeave(leaveId),
    onSuccess: () => {
      queryClient.invalidateQueries(['manager-leaves']);
      setShowModal(false);
      setSelectedLeave(null);
    },
  });

  const leaves = leavesData?.data?.leaves || [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'casual':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleApprove = async () => {
    if (selectedLeave) {
      await approveMutation.mutateAsync(selectedLeave.id);
    }
  };

  const handleReject = async () => {
    if (selectedLeave) {
      await rejectMutation.mutateAsync(selectedLeave.id);
    }
  };

  if (isLoading) {
    return (
      <ManagerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leave Requests</h1>
            <p className="text-slate-600">Manage your team's leave requests</p>
          </div>

          {/* Table skeleton */}
          <div className="animate-pulse overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="h-12 bg-slate-100"></div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 border-t border-slate-200 bg-white">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded bg-slate-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-slate-200"></div>
                      <div className="h-3 w-24 rounded bg-slate-200"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 rounded bg-slate-200"></div>
                    <div className="h-8 w-16 rounded bg-slate-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ManagerLayout>
    );
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading leave requests</h3>
              <div className="mt-2 text-sm text-red-700">
                {error.message || 'Something went wrong. Please try again.'}
              </div>
            </div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Requests</h1>
          <p className="text-slate-600">Manage your team's leave requests</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white lg:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Date Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No pending leave requests
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {leave.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">{leave.name}</div>
                          <div className="text-sm text-slate-500">{leave.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getLeaveTypeColor(leave.leave_type)}`}>
                        {leave.leave_type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      {leave.reason || 'No reason provided'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      {leave.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedLeave(leave);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Review
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 lg:hidden">
          {leaves.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-500">No pending leave requests</p>
            </div>
          ) : (
            leaves.map((leave) => (
              <div key={leave.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {leave.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{leave.name}</div>
                      <div className="text-sm text-slate-500">{leave.email}</div>
                    </div>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Type:</span>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getLeaveTypeColor(leave.leave_type)}`}>
                      {leave.leave_type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Dates:</span>
                    <span className="text-sm text-slate-900">
                      {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500">Reason:</span>
                    <p className="text-sm text-slate-900 mt-1">{leave.reason || 'No reason provided'}</p>
                  </div>
                </div>

                {leave.status === 'pending' && (
                  <button
                    onClick={() => {
                      setSelectedLeave(leave);
                      setShowModal(true);
                    }}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Review Request
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && selectedLeave && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />

              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                      <h3 className="text-lg font-medium leading-6 text-slate-900">
                        Leave Request Review
                      </h3>
                      <div className="mt-4 space-y-3">
                        <div>
                          <span className="font-medium text-slate-500">Employee:</span>
                          <p className="text-slate-900">{selectedLeave.name}</p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-500">Type:</span>
                          <span className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${getLeaveTypeColor(selectedLeave.leave_type)}`}>
                            {selectedLeave.leave_type}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-500">Dates:</span>
                          <p className="text-slate-900">
                            {new Date(selectedLeave.start_date).toLocaleDateString()} - {new Date(selectedLeave.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-500">Reason:</span>
                          <p className="text-slate-900 mt-1">{selectedLeave.reason || 'No reason provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={approveMutation.isLoading}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {approveMutation.isLoading ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={rejectMutation.isLoading}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {rejectMutation.isLoading ? 'Rejecting...' : 'Reject'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
}