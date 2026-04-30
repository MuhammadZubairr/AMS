'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await authApi.login(form);
    setLoading(false);

    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <section className="mx-auto w-full max-w-md rounded-[1.75rem] border border-blue-100 bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">DevFlx</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Sign in to manage attendance and employee records from any device.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>

          {message ? <p className="text-sm text-red-600">{message}</p> : null}
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Need an account? <a className="font-semibold text-blue-600" href="/signup">Create one</a>
        </p>
      </section>
    </main>
  );
}
