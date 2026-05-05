TC ID | Test Case Steps | Expected Result
---|---|---
TC-001 | Valid login: Enter correct email/password | User logged in, redirected to dashboard; JWT returned; session cookie set
TC-002 | Invalid login: Enter wrong password | Error message: "Invalid credentials"; failed attempt counted
TC-003 | Account lockout: Enter wrong password 5 times | Account locked; error message: "Account locked due to multiple failed login attempts. Try again later."; subsequent attempts rejected until lock expires
TC-004 | Session refresh: Wait for access token expiry, then access a protected route | Frontend auto-refreshes using refresh token, stores new access token, and retries the request successfully
TC-005 | Logout: Click logout after login | Access token cleared, refresh token revoked, session cookie removed, user redirected to login on next protected action

Notes:
- Audit logging: every login attempt is recorded to Redis list `audit:login` with fields `{ email, ip, success, reason, timestamp, role?, attempts? }`.
- Account lockout: controlled by `MAX_FAILED_ATTEMPTS` env var (default 5) and `ACCOUNT_LOCK_SECONDS` (default 900 seconds).
- Password policy enforced for create/change password via `validatePassword` in `src/utils/passwordValidator.js`.
- Refresh tokens: issued on login, rotated on refresh, stored in Redis as `refresh:<jti>`, and cleared on logout.
