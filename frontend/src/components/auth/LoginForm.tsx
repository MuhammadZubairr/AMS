'use client';

import { useState } from 'react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useAuthQuery';
import { ROUTES } from '@/constants/routes';
import { AUTH_MESSAGES } from '@/constants/auth';
import { loginValidationSchema } from '@/schemas/loginSchema';
import type { LoginFormValues } from '@/schemas/loginSchema';

function getDashboardPath(role: string | undefined): string {
  switch (role) {
    case 'superadmin':
      return ROUTES.SUPERADMIN.HOME;
    case 'hr':
      return ROUTES.HR.HOME;
    case 'manager':
      return ROUTES.MANAGER.HOME;
    case 'employee':
    default:
      return ROUTES.EMPLOYEE.HOME;
  }
}

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="flex items-center justify-center gap-3 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.6]">
            <path d="M12 1.5C9.243 1.5 7 3.743 7 6.5V8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6.5C17 3.743 14.757 1.5 12 1.5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Login Account</h1>
          <p className="mt-1 text-sm text-slate-500">{AUTH_MESSAGES.secureLogin}</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={async (values, helpers) => {
            try {
              const result = await loginMutation.mutateAsync(values);
              router.replace(getDashboardPath(result.user.role));
            } catch (error) {
              helpers.setStatus({ apiError: error instanceof Error ? error.message : AUTH_MESSAGES.invalidCredentials });
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting, status, handleChange, handleBlur, values }) => (
            <Form className="space-y-4 text-left">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email ID"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                {touched.email && errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
                <div className="flex items-stretch rounded-2xl border border-slate-200 bg-slate-50 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                    className="min-w-0 flex-1 rounded-2xl border-0 bg-transparent px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((current) => !current)}
                    className="px-4 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {touched.password && errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password}</p> : null}
              </label>

              {status?.apiError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{status.apiError}</div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting || loginMutation.isPending}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#1E75E6] px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_30px_rgba(30,117,230,0.26)] transition hover:bg-[#1868cd] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting || loginMutation.isPending ? 'Signing in...' : 'LOGIN'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
