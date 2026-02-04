
export interface LoanInput {
  principal: number;
  annual_rate: number;
  term_months: number;
  name?: string;
  last_name?: string;
  document_id?: string;
}

export interface BenchmarkResult {
  test_name: string;
  elapsed_ms: number;
  complies_requirement: boolean;
  requirement_threshold_ms: number;
  message: string;
  details: {
    simulation_id?: string;
    folio?: string;
    includes_database: boolean;
    audit_execution?: string;
    audit_blocks_response?: boolean;
    periods_calculated?: number;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface ConfigResult {
  config_name: string;
  cache_enabled: boolean;
  async_audit_enabled: boolean;
  elapsed_ms: number;
  speedup_vs_minimal: number | null;
}

export interface CompareResult {
  full_stack: ConfigResult;
  cache_only: ConfigResult;
  minimal: ConfigResult;
  winner: string;
  insights: string[];
}

export interface SimulationResult {
  simulation_id: string;
  folio: string;
  name?: string;
  last_name?: string;
  document_id?: string;
  principal: string | number;
  annual_rate: string | number;
  term_months: number;
  payment: string | number;
  total_interest: string | number;
  total_payment: string | number;
  created_at?: string;
  schedule?: Array<{
    period: number;
    payment: string | number;
    interest: string | number;
    principal: string | number;
    balance: string | number;
  }>;
}

export interface SimulationVerifyPayload {
  folio: string;
  last_name?: string;
  document_id?: string;
  name?: string;
}

export interface SimulationListResponse {
  total: number;
  limit: number;
  offset: number;
  items: SimulationResult[];
}
