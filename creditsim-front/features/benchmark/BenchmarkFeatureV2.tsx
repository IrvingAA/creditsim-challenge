import React from "react";
import { Activity, Zap, Play, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useTranslation } from "react-i18next";
import { useBenchmark } from "../../hooks/useBenchmark";
import { MetricCard } from "./components/MetricCard";
import { QuickTestCard } from "./components/QuickTestCard";
import { CompareVisualization } from "./components/CompareVisualization";
import { BenchmarkResult } from "../../domain/types";

export const BenchmarkFeature = () => {
  const { t } = useTranslation();
  const { results, loadingStates, errors, runBenchmark, compareResult, compareLoading, runCompare } = useBenchmark();

  // Calculate aggregate metrics
  const testsRun = Object.values(results).filter((r): r is BenchmarkResult => r !== null).length;
  const validResults = Object.values(results).filter((r): r is BenchmarkResult => r !== null);
  const testsCompliant = validResults.filter(r => r.complies_requirement === true).length;
  const avgTime = testsRun > 0
    ? validResults.reduce((sum, r) => sum + (r.elapsed_ms || 0), 0) / testsRun
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 tracking-tight">
            {t("benchmark.title")}
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            {t("benchmark.description")}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={runCompare}
          isLoading={compareLoading}
          className="gap-2"
        >
          <Zap size={16} />
          {t("benchmark.run_compare")}
        </Button>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label={t("benchmark.tests_run")}
          value={testsRun}
          unit={`/ 3`}
          status={testsRun === 3 ? "success" : "neutral"}
        />
        <MetricCard
          label={t("benchmark.compliance")}
          value={testsCompliant}
          unit={`/ ${testsRun || 3}`}
          status={testsCompliant === testsRun && testsRun > 0 ? "success" : "warning"}
        />
        <MetricCard
          label={t("benchmark.avg_response")}
          value={avgTime > 0 ? avgTime.toFixed(1) : "—"}
          unit="ms"
          status={avgTime > 0 && avgTime < 100 ? "success" : avgTime > 200 ? "error" : "neutral"}
          change={avgTime > 0 && avgTime < 100 ? t("benchmark.within_sla") : avgTime > 0 ? t("benchmark.above_target") : undefined}
        />
      </div>

      {/* Compare Visualization */}
      <div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-brand-500" />
          {t("benchmark.infra_comparison")}
        </h3>
        <CompareVisualization result={compareResult} loading={compareLoading} />
      </div>

      {/* Quick Tests */}
      <div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3 flex items-center gap-2">
          <Activity size={16} className="text-brand-500" />
          {t("benchmark.arch_tests")}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <QuickTestCard
            title={t("benchmark.domain_title")}
            description={t("benchmark.domain_desc")}
            result={results.domain}
            loading={loadingStates.domain}
            error={errors.domain}
            onRun={() => runBenchmark("domain")}
          />
          <QuickTestCard
            title={t("benchmark.async_title")}
            description={t("benchmark.async_desc")}
            result={results.async}
            loading={loadingStates.async}
            error={errors.async}
            onRun={() => runBenchmark("async")}
          />
          <QuickTestCard
            title={t("benchmark.sync_title")}
            description={t("benchmark.sync_desc")}
            result={results.sync}
            loading={loadingStates.sync}
            error={errors.sync}
            onRun={() => runBenchmark("sync")}
          />
          <Card className="p-4 border-dashed border-surface-300 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-900/50">
            <div className="flex items-center justify-center h-full text-surface-400 dark:text-surface-500 text-sm">
              <Play size={14} className="mr-2" />
              {t("benchmark.run_tests_msg")}
            </div>
          </Card>
        </div>
      </div>

      {/* Legend */}
      <Card className="bg-surface-50 dark:bg-surface-950 border-surface-200 dark:border-surface-800">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-surface-600 dark:text-surface-400">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              {t("benchmark.legend_compliant")}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              {t("benchmark.legend_non_compliant")}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-surface-400" />
              {t("benchmark.legend_not_tested")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
