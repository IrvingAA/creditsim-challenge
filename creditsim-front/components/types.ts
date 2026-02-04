import { ReactNode } from "react";

// ErrorBoundary types
export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ToastProvider types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

export interface ToastProviderProps {
  children: ReactNode;
}
