import React from "react";
import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { CurrencyInput } from "../../../components/ui/CurrencyInput";
import { PercentageInput } from "../../../components/ui/PercentageInput";
import { Button } from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";
import { SimulatorFormProps } from "../types";

export const SimulatorForm: React.FC<SimulatorFormProps> = ({
  input,
  onInputChange,
  onSubmit,
  loading,
  showBorrower,
  onToggleBorrower,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="shadow-lg border-brand-100 dark:border-brand-900/50">
      <CardHeader title={t("simulator.card_params")} icon={Calculator} />
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="border-b border-surface-200 dark:border-surface-800 pb-4 mb-4">
            <button
              type="button"
              onClick={onToggleBorrower}
              className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-2 w-full"
            >
              {showBorrower ? "−" : "+"} {t("simulator.borrower_optional")}
            </button>
          </div>

          {showBorrower && (
            <div className="space-y-4 pb-4 border-b border-surface-200 dark:border-surface-800 mb-4 animate-in slide-in-from-top-2 fade-in">
              <Input
                label={t("simulator.name")}
                type="text"
                value={input.name || ""}
                onChange={(e) => onInputChange({ ...input, name: e.target.value || undefined })}
              />
              <Input
                label={t("simulator.last_name")}
                type="text"
                value={input.last_name || ""}
                onChange={(e) => onInputChange({ ...input, last_name: e.target.value || undefined })}
              />
              <Input
                label={t("simulator.document_id")}
                type="text"
                value={input.document_id || ""}
                onChange={(e) => onInputChange({ ...input, document_id: e.target.value || undefined })}
              />
            </div>
          )}

          <CurrencyInput
            label={t("simulator.principal")}
            value={input.principal}
            onChange={(value) => onInputChange({ ...input, principal: value })}
          />
          <PercentageInput
            label={t("simulator.rate")}
            value={input.annual_rate}
            onChange={(value) => onInputChange({ ...input, annual_rate: value })}
          />
          <Input
            label={t("simulator.term")}
            type="number"
            value={input.term_months}
            onChange={(e) => onInputChange({ ...input, term_months: parseInt(e.target.value) })}
          />

          <Button type="submit" variant="primary" className="w-full mt-4" isLoading={loading}>
            {t("simulator.calculate")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
