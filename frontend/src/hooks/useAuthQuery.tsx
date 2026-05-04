import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as authApi from '@/api/auth';
import type { LoginPayload, LoginResponse } from '@/types/auth';

export function useMe() {
  return useQuery<LoginResponse>({ queryKey: ['auth', 'me'], queryFn: () => authApi.me(), retry: false });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation<LoginResponse, Error, LoginPayload, unknown>({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess(data) {
      try {
        if (typeof window !== 'undefined') sessionStorage.setItem('authToken', (data as any).token);
      } catch (e) {}
      // Immediately cache the user data to avoid blank screen on redirect
      qc.setQueryData(['auth', 'me'], data);
      qc.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess() {
      try {
        if (typeof window !== 'undefined') sessionStorage.removeItem('authToken');
      } catch (e) {}
      qc.clear();
    },
  });
}
