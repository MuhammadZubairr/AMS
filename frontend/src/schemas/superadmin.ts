/**
 * Yup validation schemas for Super Admin forms
 */

import * as yup from 'yup';
import { PASSWORD_REQUIREMENTS } from '@/constants/superadmin';

// Password validation rules matching backend
const passwordValidation = yup
  .string()
  .required('Password is required')
  .min(
    PASSWORD_REQUIREMENTS.minLength,
    `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`
  )
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Email validation
const emailValidation = yup
  .string()
  .required('Email is required')
  .email('Must be a valid email address');

// Name validation
const nameValidation = yup.string().required('Name is required').min(2, 'Name must be at least 2 characters');

/**
 * Schema for creating/updating manager
 */
export const createManagerSchema = yup.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export type CreateManagerFormData = yup.InferType<typeof createManagerSchema>;

/**
 * Schema for creating a generic user (manager|hr|employee)
 */
export const createUserSchema = yup.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  role: yup.string().oneOf(['manager', 'hr', 'employee']).required('Role is required'),
});

export type CreateUserFormData = yup.InferType<typeof createUserSchema>;

/**
 * Schema for creating/updating HR
 */
export const createHRSchema = yup.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export type CreateHRFormData = yup.InferType<typeof createHRSchema>;

/**
 * Schema for updating user (optional password)
 */
export const updateUserSchema = yup.object({
  name: nameValidation.optional(),
  email: emailValidation.optional(),
  role: yup
    .string()
    .oneOf(['manager', 'hr', 'employee'], 'Invalid role')
    .optional(),
  password: yup.string().optional().nullable(),
});

export type UpdateUserFormData = yup.InferType<typeof updateUserSchema>;

/**
 * Schema for password verification (one-off)
 */
export const verifyPasswordSchema = yup.object({
  password: passwordValidation,
});

export type VerifyPasswordData = yup.InferType<typeof verifyPasswordSchema>;

/**
 * Schema for search/filter users
 */
export const searchSchema = yup.object({
  query: yup.string().optional(),
  role: yup
    .string()
    .oneOf(['', 'manager', 'hr', 'employee'], 'Invalid role filter')
    .optional(),
});

export type SearchFormData = yup.InferType<typeof searchSchema>;
