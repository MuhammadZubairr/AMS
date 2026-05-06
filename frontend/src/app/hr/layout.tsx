'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import type { LayoutProps } from '@/types/components';

/**
 * HR Routes Layout
 * Provides authentication protection for all HR sub-routes
 */
export default function HRLayoutWrapper({ children }: LayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
