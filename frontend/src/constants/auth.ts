export const AUTH_MESSAGES = {
  invalidCredentials: 'Invalid credentials',
  emailRequired: 'Email is required',
  emailInvalid: 'Invalid email address',
  passwordRequired: 'Password is required',
  passwordMinLength: 'Password must be at least 8 characters',
  passwordUppercase: 'Password must include at least one uppercase letter',
  passwordLowercase: 'Password must include at least one lowercase letter',
  passwordNumber: 'Password must include at least one number',
  passwordSpecial: 'Password must include at least one special character',
  secureLogin: 'Secure login with encrypted authentication',
} as const;

export const PASSWORD_POLICY = {
  minLength: 8,
  uppercase: true,
  lowercase: true,
  number: true,
  specialChar: true,
} as const;

export const AUTH_STORAGE_KEYS = {
  authToken: 'authToken',
} as const;
