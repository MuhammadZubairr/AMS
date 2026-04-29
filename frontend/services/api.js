const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return { ok: false, error: data.error || 'Request failed' };
  }

  return { ok: true, data };
}

export const authApi = {
  signup: (payload) => request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  login: (payload) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  logout: () => request('/api/auth/logout', {
    method: 'POST',
  }),
};

export const healthApi = {
  database: () => request('/health/db', {
    method: 'GET',
  }),
};
