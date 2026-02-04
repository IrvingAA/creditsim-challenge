import { useState, useEffect, useCallback } from "react";
import { SimulationService } from "../infrastructure/api";
import { SimulationResult } from "../domain/types";

export const useSimulationHistory = (limit: number, offset: number) => {
  const [simulations, setSimulations] = useState<SimulationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SimulationService.getAll(limit, offset);
      setSimulations(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch history";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return { simulations, total, loading, error, refresh: loadHistory };
};
