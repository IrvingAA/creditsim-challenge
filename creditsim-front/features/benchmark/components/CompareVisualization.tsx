import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { CheckCircle, XCircle, Activity } from "lucide-react";
import { ConfigResult, ComparisonBarProps, CompareResult, CompareVisualizationProps } from "../types";
import { useTranslation } from "react-i18next";

const ComparisonBar: React.FC<ComparisonBarProps> = ({ config, maxTime, isWinner }) => {
  const { t } = useTranslation();
  const percentage = (config.elapsed_ms / maxTime) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isWinner ? "text-brand-600 dark:text-brand-400" : "text-surface-900 dark:text-surface-100"}`}>
            {config.config_name}
          </span>
          {isWinner && <CheckCircle size={14} className="text-emerald-500" />}
        </div>
        <span className="font-mono text-xs text-surface-600 dark:text-surface-400">
          {config.elapsed_ms.toFixed(2)}ms
        </span>
      </div>
      <div className="relative h-8 bg-surface-100 dark:bg-surface-900 rounded-lg overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isWinner
              ? "bg-gradient-to-r from-brand-500 to-brand-600"
              : "bg-gradient-to-r from-surface-300 to-surface-400 dark:from-surface-700 dark:to-surface-600"
          }`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center px-3 text-xs font-medium">
          <div className="flex items-center gap-2">
            {config.cache_enabled && (
              <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">{t("benchmark.cache")}</span>
            )}
            {config.async_audit_enabled && (
              <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">{t("benchmark.async")}</span>
            )}
            {config.speedup_vs_minimal && config.speedup_vs_minimal > 1 && (
              <span className="px-1.5 py-0.5 bg-emerald-500/30 rounded text-[10px]">
                {config.speedup_vs_minimal}x faster
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CompareVisualization: React.FC<CompareVisualizationProps> = ({ result, loading }) => {
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Activity className="animate-spin text-brand-500" size={32} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-surface-400 dark:text-surface-500 py-12">
            {t("benchmark.run_tests_msg")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxTime = Math.max(
    result.full_stack.elapsed_ms,
    result.cache_only.elapsed_ms,
    result.minimal.elapsed_ms
  );

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <ComparisonBar
            config={result.full_stack}
            maxTime={maxTime}
            isWinner={result.winner === "full_stack"}
          />
          <ComparisonBar
            config={result.cache_only}
            maxTime={maxTime}
            isWinner={result.winner === "cache_only"}
          />
          <ComparisonBar config={result.minimal} maxTime={maxTime} />
        </div>

        {result.insights.length > 0 && (
          <div className="border-t border-surface-200 dark:border-surface-800 pt-4">
            <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3">Insights</h4>
            <ul className="space-y-2">
              {result.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400">
                  <CheckCircle size={14} className="mt-0.5 text-brand-500 flex-shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
