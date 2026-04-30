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
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error && touched ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Field
        as="select"
        id={name}
        name={name}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error && touched ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-disabled ${variantClasses[variant]}`}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  );
}
