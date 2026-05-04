import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as hrApi from '@/api/hr';
import type { LeaveRequest } from '@/types/hr';

export function useHRLeaves() {
  return useQuery({
    queryKey: ['hr', 'leaves', 'pending'],
    queryFn: () => hrApi.getPendingLeaves(),
    select: (response): LeaveRequest[] =>
      response?.data?.leaves?.map((leave) => ({
        ...leave,
        user_name: leave.user_name ?? leave.name ?? '',
        user_email: leave.user_email ?? leave.email ?? '',
      })) ?? [],
  });
}

export function useApproveLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (leaveId: number) => hrApi.approveLeave(leaveId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hr', 'leaves', 'pending'] });
    },
  });
}

export function useRejectLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (leaveId: number) => hrApi.rejectLeave(leaveId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hr', 'leaves', 'pending'] });
    },
  });
}
