import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as hrApi from '@/api/hr';
import type { Employee } from '@/types/hr';

export function useHRDashboard() {
  return useQuery({ queryKey: ['hr', 'dashboard'], queryFn: () => hrApi.getDashboard(), staleTime: 1000 * 60 });
}

export function useHREmployees() {
  return useQuery<Employee[]>({ queryKey: ['hr', 'employees'], queryFn: () => hrApi.getEmployees() });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation<Employee, Error, Partial<Employee>, unknown>({
    mutationFn: (payload) => hrApi.createEmployee(payload as Partial<Employee>),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hr', 'employees'] }),
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation<Employee, Error, { id: number; payload: Partial<Employee> }, unknown>({
    mutationFn: ({ id, payload }) => hrApi.updateEmployee(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hr', 'employees'] }),
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation<import('@/types/api').ApiResponse<void>, Error, number, unknown>({
    mutationFn: (id: number) => hrApi.deleteEmployee(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hr', 'employees'] }),
  });
}
