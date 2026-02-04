import { useState } from "react";
import { BenchmarkService } from "../infrastructure/api";
import { BenchmarkResult } from "../domain/types";
import { CompareResult } from "../features/benchmark/types";
import { BenchmarkType } from "./types";

export const useBenchmark = () => {
  const [results, setResults] = useState<Record<BenchmarkType, BenchmarkResult | null>>({
    domain: null,
    async: null,
    sync: null,
  });
  const [loadingStates, setLoadingStates] = useState<Record<BenchmarkType, boolean>>({
    domain: false,
    async: false,
    sync: false,
  });
  const [errors, setErrors] = useState<Record<BenchmarkType, string | null>>({
    domain: null,
    async: null,
    sync: null,
  });
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  const runBenchmark = async (type: BenchmarkType) => {
    setLoadingStates(prev => ({ ...prev, [type]: true }));
    setErrors(prev => ({ ...prev, [type]: null }));
    try {
      let result: BenchmarkResult;
      switch (type) {
        case "domain":
          result = await BenchmarkService.runDomainOnly();
          break;
        case "async":
          result = await BenchmarkService.runAsyncAudit();
          break;
        case "sync":
          result = await BenchmarkService.runSyncAuditWrong();
          break;
      }
      setResults(prev => ({ ...prev, [type]: result }));
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || "Failed to run benchmark";
      setErrors(prev => ({ ...prev, [type]: errorMessage }));
      console.error(`Benchmark ${type} failed:`, error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    }
  };

  const runCompare = async () => {
    setCompareLoading(true);
    setCompareError(null);
    try {
      const result = await BenchmarkService.runCompare();
      setCompareResult(result);
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || "Failed to run compare";
      setCompareError(errorMessage);
      console.error("Compare benchmark failed:", error);
      throw error;
    } finally {
      setCompareLoading(false);
    }
  };

  return { results, loadingStates, errors, runBenchmark, compareResult, compareLoading, compareError, runCompare };
};
