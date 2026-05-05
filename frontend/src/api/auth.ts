import { request } from '@/api/client';
import { AUTH_STORAGE_KEYS } from '@/constants/auth';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { LoginPayload, LoginResponse, ChangePasswordPayload } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await request<LoginResponse>({ url: API_ENDPOINTS.AUTH.LOGIN, method: 'post', data: payload });
  return res;
}

export async function logout(): Promise<ApiResponse<void>> {
  const res = await request<ApiResponse<void>>({ url: API_ENDPOINTS.AUTH.LOGOUT, method: 'post' });
  try {
    if (typeof window !== 'undefined') sessionStorage.removeItem(AUTH_STORAGE_KEYS.authToken);
  } catch (e) {}
  return res;
}

export async function refresh(): Promise<LoginResponse> {
  const res = await request<LoginResponse>({ url: API_ENDPOINTS.AUTH.REFRESH, method: 'post' });
  return res;
}

export async function me(): Promise<LoginResponse> {
  const res = await request<LoginResponse>({ url: API_ENDPOINTS.AUTH.ME, method: 'get' });
  return res;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<ApiResponse<void>> {
  const res = await request<ApiResponse<void>>({ url: API_ENDPOINTS.AUTH.CHANGE_PASSWORD, method: 'post', data: payload });
  return res;
}
