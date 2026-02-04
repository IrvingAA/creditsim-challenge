import React from "react";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { useTranslation } from "react-i18next";
import { SimulationDetailsProps } from "../types";

export const SimulationDetails: React.FC<SimulationDetailsProps> = ({ result }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t("simulator.details")} icon={CheckCircle} />
      <CardContent>
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div className="flex flex-col">
            <span className="text-surface-500 dark:text-surface-400">{t("simulator.id")}</span>
            <span className="font-mono text-surface-900 dark:text-surface-200">{result.simulation_id}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-surface-500 dark:text-surface-400">{t("simulator.folio")}</span>
            <span className="font-mono text-surface-900 dark:text-surface-200">{result.folio}</span>
          </div>
          {result.name && (
            <div className="flex flex-col">
              <span className="text-surface-500 dark:text-surface-400">{t("simulator.borrower")}</span>
              <span className="text-surface-900 dark:text-surface-200">
                {result.name} {result.last_name}
              </span>
            </div>
          )}
          {result.document_id && (
            <div className="flex flex-col">
              <span className="text-surface-500 dark:text-surface-400">{t("simulator.document")}</span>
              <span className="font-mono text-surface-900 dark:text-surface-200">{result.document_id}</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-surface-500 dark:text-surface-400">{t("simulator.created_at")}</span>
            <span className="text-surface-900 dark:text-surface-200">
              {new Date(result.created_at || Date.now()).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
