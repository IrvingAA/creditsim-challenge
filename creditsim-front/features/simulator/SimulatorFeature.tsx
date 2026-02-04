import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import { LoanInput } from "../../domain/types";
import { useSimulation } from "../../hooks/useSimulation";
import { DEFAULT_LOAN_VALUES } from "../../constants/defaults";
import { Button } from "../../components/ui/Button";
import { downloadSimulationPdf } from "../../lib/pdf";
import { SimulatorForm } from "./components/SimulatorForm";
import { SimulatorLoading } from "./components/SimulatorLoading";
import { SimulatorError } from "./components/SimulatorError";
import { SimulatorEmptyState } from "./components/SimulatorEmptyState";
import { SimulationMetrics } from "./components/SimulationMetrics";
import { SimulationDetails } from "./components/SimulationDetails";
import { AmortizationTable } from "./components/AmortizationTable";

export const SimulatorFeature = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState<LoanInput>({
    principal: DEFAULT_LOAN_VALUES.PRINCIPAL,
    annual_rate: DEFAULT_LOAN_VALUES.ANNUAL_RATE,
    term_months: DEFAULT_LOAN_VALUES.TERM_MONTHS,
    name: "",
    last_name: "",
    document_id: "",
  });
  const [showBorrower, setShowBorrower] = useState(false);
  const { result, loading, error, simulate } = useSimulation();

  const handleDownloadPdf = () => {
    if (!result) return;
    downloadSimulationPdf(result, t);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await simulate(input);
    } catch (err) {
      console.error("Simulation failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-surface-900 dark:text-surface-100">{t("simulator.title")}</h2>
        <p className="text-surface-500 dark:text-surface-400 mt-2">{t("simulator.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <SimulatorForm
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            loading={loading}
            showBorrower={showBorrower}
            onToggleBorrower={() => setShowBorrower(!showBorrower)}
          />
        </div>

        <div className="md:col-span-2 space-y-6">
          {loading && <SimulatorLoading />}
          {error && <SimulatorError />}
          {!result && !loading && !error && <SimulatorEmptyState />}

          {result && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleDownloadPdf}>
                  <Download size={16} />
                  {t("simulator.download_pdf")}
                </Button>
              </div>
              <SimulationMetrics
                payment={result.payment}
                totalInterest={result.total_interest}
                totalPayment={result.total_payment}
              />
              <SimulationDetails result={result} />
              <AmortizationTable schedule={result.schedule || []} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
