import React from "react";
import { LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../lib/currency";
import { AmortizationTableProps } from "../types";

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule }) => {
  const { t } = useTranslation();

  if (!schedule || schedule.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader title={t("simulator.schedule_title")} icon={LayoutDashboard} />
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800 text-surface-500 dark:text-surface-400">
              <tr>
                <th className="px-4 py-2 text-center">{t("simulator.period")}</th>
                <th className="px-4 py-2 text-right">{t("simulator.payment")}</th>
                <th className="px-4 py-2 text-right">{t("simulator.interest")}</th>
                <th className="px-4 py-2 text-right">{t("simulator.principal_col")}</th>
                <th className="px-4 py-2 text-right">{t("simulator.balance")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {schedule.map((row) => (
                <tr key={row.period} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  <td className="px-4 py-2 text-center font-mono text-surface-600 dark:text-surface-400">
                    {row.period}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-surface-900 dark:text-surface-100">
                    {formatCurrency(row.payment)}
                  </td>
                  <td className="px-4 py-2 text-right text-surface-600 dark:text-surface-300">
                    {formatCurrency(row.interest)}
                  </td>
                  <td className="px-4 py-2 text-right text-surface-600 dark:text-surface-300">
                    {formatCurrency(row.principal)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-surface-900 dark:text-surface-100">
                    {formatCurrency(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
