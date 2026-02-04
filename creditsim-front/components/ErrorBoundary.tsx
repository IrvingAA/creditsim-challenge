import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ErrorBoundaryProps, ErrorBoundaryState } from "./types";

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
              Something went wrong
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
