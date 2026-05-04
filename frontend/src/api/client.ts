import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/constants/endpoints';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Allow sending cookies for same-origin auth flows; Authorization header still supported
  withCredentials: true,
});

// Attach auth token from sessionStorage for per-tab auth
client.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('authToken') : null;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

export default client;

export async function request<T>(p: { url: string; method?: 'get' | 'post' | 'put' | 'delete' | 'patch'; data?: any; params?: any; headers?: Record<string, string> }): Promise<T> {
  const { url, method = 'get', data, params, headers } = p;
  const res = await client.request<T>({ url, method, data, params, headers });
  return res.data as T;
}
