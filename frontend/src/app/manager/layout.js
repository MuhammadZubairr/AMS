'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

/**
 * Manager Routes Layout
 * Provides authentication protection for all Manager sub-routes
 */
export default function ManagerLayoutWrapper({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
