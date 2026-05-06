'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import type { LayoutProps } from '@/types/components';

/**
 * Super Admin Routes Layout
 * Provides authentication protection for all superadmin sub-routes
 */
export default function SuperAdminLayoutWrapper({ children }: LayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
