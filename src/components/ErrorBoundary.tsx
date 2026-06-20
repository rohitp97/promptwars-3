import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Trace ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen bg-base text-green-50 flex flex-col items-center justify-center gap-6 px-8 text-center"
        >
          <span className="text-5xl" aria-hidden="true">🌿</span>
          <h1 className="text-xl font-bold text-green-50">Something went wrong</h1>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            Trace hit an unexpected error. Your journal is safe in local storage.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm focus-visible:outline-none"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
