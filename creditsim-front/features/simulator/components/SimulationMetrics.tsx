import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { AutoFitText } from "../../../components/ui/AutoFitText";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../lib/currency";
import { SimulationMetricsProps } from "../types";

export const SimulationMetrics: React.FC<SimulationMetricsProps> = ({
  payment,
  totalInterest,
  totalPayment,
}) => {
  const { t } = useTranslation();
  const paymentText = formatCurrency(payment);
  const interestText = formatCurrency(totalInterest);
  const totalText = formatCurrency(totalPayment);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-brand-600 dark:bg-brand-700 text-white border-none shadow-brand-200 dark:shadow-none min-w-0">
        <CardContent className="p-4 text-center text-white dark:text-white min-w-0">
          <p className="text-white/70 text-[11px] sm:text-xs font-medium uppercase tracking-[0.16em] mb-1">
            {t("simulator.monthly_payment")}
          </p>
          <AutoFitText
            text={paymentText}
            className="font-semibold px-2 text-white dark:text-white"
            maxFontPx={34}
            minFontPx={16}
          />
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardContent className="p-4 text-center min-w-0">
          <p className="text-surface-500 dark:text-surface-400 text-[11px] sm:text-xs font-medium uppercase tracking-[0.16em] mb-1">
            {t("simulator.total_interest")}
          </p>
          <AutoFitText
            text={interestText}
            className="font-semibold px-2 text-surface-900 dark:text-surface-100"
            maxFontPx={34}
            minFontPx={16}
          />
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardContent className="p-4 text-center min-w-0">
          <p className="text-surface-500 dark:text-surface-400 text-[11px] sm:text-xs font-medium uppercase tracking-[0.16em] mb-1">
            {t("simulator.total_cost")}
          </p>
          <AutoFitText
            text={totalText}
            className="font-semibold px-2 text-surface-900 dark:text-surface-100"
            maxFontPx={34}
            minFontPx={16}
          />
        </CardContent>
      </Card>
    </div>
  );
};
