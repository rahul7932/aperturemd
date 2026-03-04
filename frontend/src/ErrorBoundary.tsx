import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Frontend render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface text-text-primary flex items-center justify-center px-6">
          <div className="max-w-lg w-full bg-surface-elevated border border-contradicts/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-contradicts/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-contradicts" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 3a9 9 0 11-9 9"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Something went wrong</h1>
                <p className="text-sm text-text-muted">
                  The interface hit an unexpected error while rendering. Try refreshing the page; if the problem
                  persists, check the browser console and backend logs.
                </p>
              </div>
            </div>
            {this.state.message && (
              <div className="text-xs text-text-muted bg-surface border border-surface-hover rounded-xl p-3 font-mono break-words">
                {this.state.message}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

