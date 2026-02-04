import React from "react";
import { CheckCircle, XCircle, Loader2, Play } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { QuickTestCardProps } from "../types";

export const QuickTestCard: React.FC<QuickTestCardProps> = ({
  title,
  description,
  result,
  loading,
  onRun,
  compact = false,
  error = null,
}) => {
  const hasResult = result !== null;
  const isCompliant = result?.complies_requirement === true;
  const hasError = !!error;

  return (
    <div className={`p-4 border rounded-lg transition-all ${
      hasError
        ? "border-red-500/30 bg-red-50/50 dark:bg-red-950/20"
        : hasResult
        ? isCompliant
          ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20"
          : "border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20"
        : "border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
              {title}
            </h4>
            {hasError ? (
              <XCircle size={16} className="text-red-500 flex-shrink-0" />
            ) : hasResult && (
              isCompliant ? (
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
              ) : (
                <XCircle size={16} className="text-rose-500 flex-shrink-0" />
              )
            )}
          </div>
          {!compact && description && (
            <p className="text-xs text-surface-600 dark:text-surface-400 line-clamp-2 mb-2">
              {description}
            </p>
          )}
          {hasError && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-2">
              {error}
            </div>
          )}
          {hasResult && !hasError && (
            <div className="flex items-center gap-3 text-xs mt-2">
              <span className="font-mono text-surface-900 dark:text-surface-100">
                {result.elapsed_ms.toFixed(2)}ms
              </span>
              <span className="text-surface-500 dark:text-surface-400">
                {result.message}
              </span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRun}
          isLoading={loading}
          className="flex-shrink-0"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
        </Button>
      </div>
    </div>
  );
};
