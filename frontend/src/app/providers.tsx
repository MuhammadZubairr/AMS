'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { ProvidersProps } from '@/types/components';

/**
 * Providers Component
 * Global providers wrapper for React Query and error handling
 * Initializes QueryClient with production-ready defaults
 */
export default function Providers({ children }: ProvidersProps): React.ReactElement {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </QueryClientProvider>
  );
}
