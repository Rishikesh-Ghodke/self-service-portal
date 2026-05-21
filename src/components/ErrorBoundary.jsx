import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
          <h1 className="text-xl font-semibold text-text">Something went wrong</h1>
          <p className="mt-2 text-sm text-text-muted">
            Please refresh the page. If the problem continues, contact support.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
