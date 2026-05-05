import * as Yup from 'yup';
import { AUTH_MESSAGES, PASSWORD_POLICY } from '@/constants/auth';

/**
 * Login form validation schema
 */
export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(AUTH_MESSAGES.emailInvalid)
    .required(AUTH_MESSAGES.emailRequired),
  password: Yup.string()
    .required(AUTH_MESSAGES.passwordRequired)
    .min(PASSWORD_POLICY.minLength, AUTH_MESSAGES.passwordMinLength)
    .matches(/[A-Z]/, AUTH_MESSAGES.passwordUppercase)
    .matches(/[a-z]/, AUTH_MESSAGES.passwordLowercase)
    .matches(/[0-9]/, AUTH_MESSAGES.passwordNumber)
    .matches(/[!@#$%^&*(),.?"':{}|<>]/, AUTH_MESSAGES.passwordSpecial),
});

export type LoginFormValues = Yup.InferType<typeof loginValidationSchema>;
