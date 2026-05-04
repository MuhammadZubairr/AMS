'use client';

import React from 'react';

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console for now — could be extended to send to monitoring
    // Keep minimal to avoid leaking sensitive info.
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">An unexpected error occurred while loading the app.</p>
            <details className="whitespace-pre-wrap text-xs text-red-600">
              {this.state.error?.message}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
