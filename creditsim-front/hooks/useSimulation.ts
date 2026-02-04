import { useState } from "react";
import { SimulationService } from "../infrastructure/api";
import { LoanInput, SimulationResult } from "../domain/types";

export const useSimulation = () => {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulate = async (input: LoanInput) => {
    setLoading(true);
    setError(null);
    try {
      const cleanedInput = {
        ...input,
        name: input.name && input.name.trim() !== "" ? input.name : undefined,
        last_name: input.last_name && input.last_name.trim() !== "" ? input.last_name : undefined,
        document_id: input.document_id && input.document_id.trim() !== "" ? input.document_id : undefined,
      };
      const data = await SimulationService.simulate(cleanedInput);
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate simulation";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { result, loading, error, simulate, reset };
};
