'use client';

import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SuperAdminIcon } from './Icon';
import { FormSubmit } from './FormFields';
import { departments as mockDepartments } from './mockData';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export type CreateUserRole = 'manager' | 'hr' | 'employee';

export interface CreateUserFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: CreateUserRole;
  department: string;
  phoneNumber: string;
}

export const createUserFormSchema = Yup.object({
  name: Yup.string().required('Full Name is required').min(2, 'Name must be at least 2 characters'),
  email: Yup.string().required('Email is required').email('Must be a valid email'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(passwordRegex, 'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  role: Yup.string().required('Role is required').oneOf(['manager', 'hr', 'employee']),
  department: Yup.string().when('role', {
    is: (role: string) => role !== 'hr',
    then: (schema) => schema.required('Department is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  phoneNumber: Yup.string().required('Phone Number is required'),
});

interface CreateUserFormProps {
  submitLabel: string;
  onSubmit: (values: CreateUserFormValues) => Promise<void> | void;
  onCancel?: () => void;
  cancelLabel?: string;
  lockedRole?: CreateUserRole;
  initialRole?: CreateUserRole;
}

export function CreateUserForm({
  submitLabel,
  onSubmit,
  onCancel,
  cancelLabel = 'Cancel',
  lockedRole,
  initialRole = lockedRole || 'employee',
}: CreateUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: initialRole,
        department: '',
        phoneNumber: '',
      }}
      validationSchema={createUserFormSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-900">
                  Full Name
                </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.name && touched.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                  Email Address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@devflx.com"
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.email && touched.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-900">
                  Phone Number
                </label>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+92 300 1234567"
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Organization</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-900">
                  Role
                </label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  disabled={!!lockedRole}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    const nextRole = event.target.value as CreateUserRole;
                    setFieldValue('role', nextRole);
                    if (nextRole === 'hr') {
                      setFieldValue('department', '');
                    }
                  }}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                </Field>
                {lockedRole && <p className="mt-1 text-xs text-slate-500">Role is fixed for this page.</p>}
                {errors.role && touched.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
              </div>

              {values.role !== 'hr' ? (
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-slate-900">
                    Department
                  </label>
                  <Field
                    as="select"
                    id="department"
                    name="department"
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select a department</option>
                    {mockDepartments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </Field>
                  {errors.department && touched.department && (
                    <p className="mt-1 text-xs text-red-600">{errors.department}</p>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 sm:col-span-2">
                  HR users work across the whole office, so no department is required.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Security</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-900">
                  Password
                </label>
                <div className="relative mt-1">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    <SuperAdminIcon name={showPassword ? 'eye' : 'eyeOff'} className="h-4 w-4" />
                  </button>
                </div>
                {errors.password && touched.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                <p className="mt-2 text-xs text-slate-500">
                  Must contain: 8+ characters, uppercase, lowercase, number, special character (@$!%*?&)
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-900">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    <SuperAdminIcon name={showConfirmPassword ? 'eye' : 'eyeOff'} className="h-4 w-4" />
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  {cancelLabel}
                </button>
              )}
              <FormSubmit isLoading={isSubmitting} label={submitLabel} />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
