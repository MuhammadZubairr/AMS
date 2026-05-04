'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '@/services/api';

function getDashboardPath(role) {
  switch (role) {
    case 'superadmin':
      return '/superadmin';
    case 'hr':
      return '/hr';
    case 'manager':
      return '/manager/dashboard';
    case 'employee':
    default:
      return '/employee/dashboard';
  }
}

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

    const role = result.data?.user?.role;
    router.replace(getDashboardPath(role));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef3ff] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.16),transparent_30%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
        <section className="grid w-full max-w-[1000px] overflow-hidden rounded-[2px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] ring-1 ring-white/50 lg:h-[600px] lg:grid-cols-[1fr_1fr]">
          <div className="relative h-full min-h-[320px] overflow-hidden bg-[#1e75e6] text-white sm:min-h-[360px] lg:h-full">
            <img
              aria-hidden
              src="/images/left side image login.png"
              alt=""
              className="absolute left-0 top-0 h-[calc(100%+120px)] min-w-full w-auto object-cover"
              style={{ transform: 'translateY(-48px) scale(1.22)' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,117,230,0.10)_0%,rgba(30,117,230,0.06)_52%,rgba(30,117,230,0.18)_100%)]" />

            <div className="absolute inset-0 z-10 flex flex-col px-6 py-8 sm:px-8 lg:px-8 lg:py-10">
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <p className="text-[0.95rem] font-medium tracking-[0.12em] text-white/85 sm:text-[1.05rem]">Nice to see you again</p>
                <h1 className="mt-3 text-[2.35rem] font-light uppercase tracking-[0.09em] text-white sm:text-[2.9rem] lg:text-[3.2rem]">WELCOME BACK</h1>
                <div className="mt-5 h-1 w-10 rounded-full bg-white/90" />
                <p className="mx-auto mt-6 max-w-[280px] text-sm leading-6 text-white/90 sm:text-[0.95rem]">
                  Log in to access your dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
            <div className="w-full max-w-[420px] text-center">
              <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-800 sm:text-[2.25rem]">Login Account</h1>
              <p className="mx-auto mt-4 max-w-[360px] text-sm leading-6 text-slate-500 sm:text-[0.98rem]">
                Please enter your account credentials to continue.
              </p>

              <form onSubmit={handleSubmit} className="mt-12 space-y-5 text-left">
                <label className="block">
                  <span className="sr-only">Email ID</span>
                  <div className="flex items-center bg-[#f6f6f6] shadow-[inset_4px_0_0_#1E75E6] transition focus-within:shadow-[inset_4px_0_0_#1E75E6,0_0_0_4px_rgba(30,117,230,0.08)]">
                    <input
                      type="email"
                      required
                      placeholder="Email ID"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      className="w-full bg-transparent px-4 py-3.5 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="sr-only">Password</span>
                  <div className="flex items-center bg-[#f6f6f6] shadow-[inset_4px_0_0_#1E75E6] transition focus-within:shadow-[inset_4px_0_0_#1E75E6,0_0_0_4px_rgba(30,117,230,0.08)]">
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={form.password}
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                      className="w-full bg-transparent px-4 py-3.5 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>


                {message ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p> : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 flex w-full items-center justify-center rounded-full bg-[#1E75E6] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_12px_30px_rgba(30,117,230,0.28)] transition hover:bg-[#1868cd] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Signing in...' : 'LOGIN'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}