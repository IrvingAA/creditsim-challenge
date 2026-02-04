import axios, { AxiosInstance } from "axios";
import {
  LoanInput,
  SimulationResult,
  BenchmarkResult,
  CompareResult,
  SimulationListResponse,
  SimulationVerifyPayload,
} from "../domain/types";
import { API_CONFIG } from "../constants/defaults";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || API_CONFIG.DEFAULT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": navigator.language || "en",
  },
  timeout: API_CONFIG.TIMEOUT,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const BenchmarkService = {
  ping: async () => {
    const { data } = await apiClient.get<{ status: string }>("/benchmark/ping");
    return data;
  },
  runDomainOnly: async () => {
    const { data } = await apiClient.get<BenchmarkResult>("/benchmark/domain-only");
    return data;
  },
  runAsyncAudit: async () => {
    const { data } = await apiClient.post<BenchmarkResult>("/benchmark/async-audit", {});
    return data;
  },
  runSyncAuditWrong: async () => {
    const { data } = await apiClient.post<BenchmarkResult>("/benchmark/sync-audit-wrong", {});
    return data;
  },
  runCompare: async () => {
    const { data } = await apiClient.post("/benchmark/compare", {});
    return data;
  },
} as const;

export const SimulationService = {
  simulate: async (input: LoanInput) => {
    const { data } = await apiClient.post<SimulationResult>("/simulate", input);
    return data;
  },
  getAll: async (limit = 20, offset = 0) => {
    const { data } = await apiClient.get<SimulationListResponse>("/simulations", {
      params: { limit, offset },
    });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<SimulationResult>(`/simulations/${id}`);
    return data;
  },
  verify: async (id: string, payload: SimulationVerifyPayload) => {
    const { data } = await apiClient.post<SimulationResult>(`/simulations/${id}/verify`, payload);
    return data;
  },
} as const;

export { apiClient };
