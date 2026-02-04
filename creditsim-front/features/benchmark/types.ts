// Benchmark domain types
export interface CompareResult {
  full_stack: ConfigResult;
  cache_only: ConfigResult;
  minimal: ConfigResult;
  winner: string;
  insights: string[];
}

export interface ConfigResult {
  config_name: string;
  cache_enabled: boolean;
  async_audit_enabled: boolean;
  elapsed_ms: number;
  speedup_vs_minimal: number | null;
}

// Component props
export interface CompareVisualizationProps {
  result: CompareResult | null;
  loading: boolean;
}

export interface ComparisonBarProps {
  config: ConfigResult;
  maxTime: number;
  isWinner?: boolean;
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: "success" | "warning" | "error" | "neutral";
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface QuickTestCardProps {
  title: string;
  description?: string;
  result: import("../../domain/types").BenchmarkResult | null;
  loading: boolean;
  onRun: () => void;
  compact?: boolean;
  error?: string | null;
}
