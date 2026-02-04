import { SimulationResult } from "../../domain/types";

// Component props
export interface HistoryVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSim: SimulationResult | null;
  verifiedSim: SimulationResult | null;
  verifying: boolean;
  verifyError: string | null;
}
