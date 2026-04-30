'use client';

import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EmployeeLayout from '@/components/employee/Layout';
import { leaveApi } from '@/services/api';

const leaveTypes = [
  { value: 'sick', label: 'Sick Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'paid', label: 'Paid Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
];

export default function LeaveRequestPage() {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({ leave_type: 'sick', start_date: '', end_date: '', reason: '' });
  const [message, setMessage] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-leaves'],
    queryFn: () => leaveApi.getMyLeaves(),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => leaveApi.requestLeave(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-leaves'] });
      setFormState({ leave_type: 'sick', start_date: '', end_date: '', reason: '' });
      setMessage({ type: 'success', text: 'Leave request sent successfully.' });
    },
    onError: (err) => {
      setMessage({ type: 'error', text: err?.message || 'Unable to submit leave request.' });
    },
  });

  const leaves = useMemo(() => data?.data?.leaves || [], [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!formState.start_date || !formState.end_date || !formState.reason) {
      setMessage({ type: 'error', text: 'Please complete all fields before submitting.' });
      return;
    }

    await createMutation.mutateAsync(formState);
  };

  return (
    <EmployeeLayout title="Leave Requests">
      <div className="space-y-6">
        <div className="rounded-2xl border border-blue-100 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Request Leave</h2>
          <p className="mt-2 text-sm text-slate-600">Submit a leave request and track its approval status.</p>

          {message && (
            <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Leave Type</label>
              <select
                value={formState.leave_type}
                onChange={(e) => setFormState({ ...formState, leave_type: e.target.value })}
                className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {leaveTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Start Date</label>
                <input
                  type="date"
                  value={formState.start_date}
                  onChange={(e) => setFormState({ ...formState, start_date: e.target.value })}
                  className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">End Date</label>
                <input
                  type="date"
                  value={formState.end_date}
                  onChange={(e) => setFormState({ ...formState, end_date: e.target.value })}
                  className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Reason</label>
              <textarea
                rows="4"
                value={formState.reason}
                onChange={(e) => setFormState({ ...formState, reason: e.target.value })}
                className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {createMutation.isLoading ? 'Submitting...' : 'Submit Leave Request'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">My Leave Requests</h2>
              <p className="mt-1 text-sm text-slate-600">Track your leaves and their approval status.</p>
            </div>
            <span className="text-sm text-slate-500">{leaves.length} requests</span>
          </div>

          {isLoading ? (
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <p className="mt-6 text-sm text-red-600">Unable to load your leave requests.</p>
          ) : leaves.length === 0 ? (
            <p className="mt-6 text-sm text-slate-600">No leave requests yet. Submit one above.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {leaves.map((leave) => (
                <div key={leave.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">{leave.leave_type.toUpperCase()} leave</p>
                      <h3 className="text-lg font-semibold text-slate-900">{new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {leave.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{leave.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
}
