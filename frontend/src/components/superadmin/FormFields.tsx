/**
 * Formik Form Components
 */

import React from 'react';
import { Field } from 'formik';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  disabled,
  error,
  touched,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 ${
          error && touched ? 'border-red-500' : 'border-slate-300'
        } ${disabled ? 'cursor-not-allowed bg-slate-100' : ''}`}
      />
      {error && touched && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Select field component
 */
interface FormSelectProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

export function FormSelect({
  name,
  label,
  options,
  disabled,
  error,
  touched,
}: FormSelectProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <Field
        as="select"
        id={name}
        name={name}
        disabled={disabled}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 ${
          error && touched ? 'border-red-500' : 'border-slate-300'
        } ${disabled ? 'cursor-not-allowed bg-slate-100' : ''}`}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Field>
      {error && touched && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Submit button for forms
 */
interface FormSubmitProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'danger';
}

export function FormSubmit({
  label,
  isLoading,
  disabled,
  variant = 'primary',
}: FormSubmitProps) {
  const variantClasses = {
    primary: 'btn-create-action',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`w-full rounded-full px-4 py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]}`}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  );
}
