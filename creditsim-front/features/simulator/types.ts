import React from "react";
import { LoanInput, SimulationResult } from "../../domain/types";

// Component props
export interface SimulatorFormProps {
  input: LoanInput;
  onInputChange: (input: LoanInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  showBorrower: boolean;
  onToggleBorrower: () => void;
}

export interface SimulationMetricsProps {
  payment: string | number;
  totalInterest: string | number;
  totalPayment: string | number;
}

export interface SimulationDetailsProps {
  result: SimulationResult;
}

export interface ScheduleRow {
  period: number;
  payment: string | number;
  interest: string | number;
  principal: string | number;
  balance: string | number;
}

export interface AmortizationTableProps {
  schedule: ScheduleRow[];
}
