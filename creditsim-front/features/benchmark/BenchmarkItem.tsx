import React from "react";
import { Play, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { BenchmarkResult } from "../../domain/types";
import { useTranslation } from "react-i18next";

export interface BenchmarkItemProps {
  title: string;
  description: string;
  onRun: () => void;
  result: BenchmarkResult | null;
  loading?: boolean;
  error?: string | null;
}

export const BenchmarkItem = ({ title, description, onRun, result, loading = false, error = null }: BenchmarkItemProps) => {
  const { t } = useTranslation();

  return (
    <div className="border border-surface-100 dark:border-surface-800 rounded-lg bg-surface-50/50 dark:bg-surface-800/20 p-4 hover:border-brand-100 dark:hover:border-brand-900 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h4 className="font-semibold text-surface-900 dark:text-surface-100">{title}</h4>
          <p className="text-sm text-surface-500 dark:text-surface-400">{description}</p>
        </div>
        <Button onClick={onRun} isLoading={loading} variant="outline" className="shrink-0">
          <Play size={14} /> {t("benchmark.run_test")}
        </Button>
      </div>

      {error && (
        <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-500 shrink-0" size={20} />
            <div>
              <p className="font-medium text-red-900 dark:text-red-100 text-sm">Error running test</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-md p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 mb-3">
            {result.complies_requirement ? (
              <CheckCircle className="text-emerald-500" size={20} />
            ) : (
              <XCircle className="text-rose-500" size={20} />
            )}
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <span className="font-medium text-surface-900 dark:text-surface-100">{result.message}</span>
                <span className={cn(
                  "font-mono text-sm font-bold",
                  result.complies_requirement ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                )}>
                  {result.elapsed_ms}ms
                </span>
              </div>
              <div className="w-full bg-surface-100 dark:bg-surface-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={cn("h-full rounded-full", result.complies_requirement ? "bg-emerald-500" : "bg-rose-500")} 
                  style={{ width: `${Math.min((result.elapsed_ms / result.requirement_threshold_ms) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="text-xs text-surface-500 dark:text-surface-400 grid grid-cols-2 gap-2 bg-surface-50 dark:bg-surface-950 p-2 rounded border border-surface-100 dark:border-surface-800">
            {Object.entries(result.details).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="uppercase text-[10px] tracking-wider text-surface-400 dark:text-surface-500 font-semibold">{key.replace(/_/g, " ")}</span>
                <span className="font-mono text-surface-700 dark:text-surface-300 truncate" title={String(value)}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
