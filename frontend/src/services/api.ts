import { API_ENDPOINTS, API_BASE_URL } from '@/constants/endpoints';
import { AUTH_STORAGE_KEYS } from '@/constants/auth';

/**
 * Request types
 */
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface LeavePayload {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

/**
 * Get auth token from sessionStorage (per-tab token)
 * @returns {string | null} Auth token or null if not found
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(AUTH_STORAGE_KEYS.authToken);
}

/**
 * Make API request with Authorization header support
 * @param {string} path - API endpoint path
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<ApiResponse>} API response
 */
async function request<T = any>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const authToken = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {}),
      },
      credentials: 'include',
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (
        response.status === 401 &&
        typeof window !== 'undefined' &&
        path !== API_ENDPOINTS.AUTH.LOGIN &&
        path !== API_ENDPOINTS.AUTH.REFRESH &&
        path !== API_ENDPOINTS.AUTH.LOGOUT
      ) {
        const refreshed = await refreshAuthSession();
        if (refreshed.ok) {
          const retryToken = getAuthToken();
          const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
            headers: {
              'Content-Type': 'application/json',
              ...(retryToken ? { Authorization: `Bearer ${retryToken}` } : {}),
              ...(options.headers || {}),
            },
            credentials: 'include',
            ...options,
          });

          const retryData = await retryResponse.json().catch(() => ({}));
          if (retryResponse.ok) {
            return { ok: true, data: retryData };
          }

          return { ok: false, error: retryData.error || 'Request failed' };
        }
      }

      return { ok: false, error: data.error || 'Request failed' };
    }

    return { ok: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed';
    const normalizedMessage =
      /failed to fetch|network|load failed/i.test(message)
        ? 'Unable to connect to the server. Please check backend/API URL and try again.'
        : message;

    return { ok: false, error: normalizedMessage };
  }
}

export { request };

async function refreshAuthSession(): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.authToken);
      }
      return { ok: false, error: data.error || 'Session expired' };
    }

    if (data?.token && typeof window !== 'undefined') {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.authToken, data.token);
    }

    return { ok: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed';
    return { ok: false, error: message };
  }
}

/**
 * Authentication API service
 */
export const authApi = {
  /**
   * Login user with email and password
   * @param {LoginPayload} payload - Login credentials
   * @returns {Promise<ApiResponse<LoginResponse>>} Login response with token
   */
  login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
    const result = await request<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (result.ok && result.data?.token && typeof window !== 'undefined') {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.authToken, result.data.token);
    }

    return result;
  },

  refresh: (): Promise<ApiResponse<LoginResponse>> => refreshAuthSession(),

  /**
   * Logout user
   * @returns {Promise<ApiResponse>} Logout response
   */
  logout: (): Promise<ApiResponse> =>
    request(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    }).finally(() => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.authToken);
      }
    }),
};

/**
 * Leave request API service
 */
export const leaveApi = {
  /**
   * Submit a leave request
   * @param {LeavePayload} payload - Leave request details
   * @returns {Promise<ApiResponse>} Response from server
   */
  requestLeave: (payload: LeavePayload): Promise<ApiResponse> =>
    request('/api/leaves', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Get user's leave requests
   * @returns {Promise<ApiResponse>} User's leaves
   */
  getMyLeaves: (): Promise<ApiResponse> => request('/api/leaves'),
};

/**
 * Health check API service
 */
export const healthApi = {
  /**
   * Check database health
   * @returns {Promise<ApiResponse>} Database health status
   */
  database: (): Promise<ApiResponse> =>
    request(API_ENDPOINTS.HEALTH.DB, {
      method: 'GET',
    }),
};
