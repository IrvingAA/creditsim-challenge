import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ThemeProvider } from "./lib/theme-provider";
import { ToastProvider } from "./components/ToastProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./lib/i18n";

const root = createRoot(document.getElementById("root")!);
root.render(
  <ErrorBoundary>
    <ThemeProvider defaultTheme="light" storageKey="creditsim-theme">
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
