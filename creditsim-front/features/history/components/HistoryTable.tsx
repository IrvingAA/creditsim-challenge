import React from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../lib/currency";
import { SimulationResult } from "../../../domain/types";

type HistoryTableProps = {
  simulations: SimulationResult[];
  loading: boolean;
  onView: (sim: SimulationResult) => void;
  disableActions?: boolean;
};

export const HistoryTable: React.FC<HistoryTableProps> = ({
  simulations,
  loading,
  onView,
  disableActions = false,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-50 dark:bg-surface-800 text-surface-500 dark:text-surface-400 font-medium border-b border-surface-200 dark:border-surface-700">
            <tr>
              <th className="px-6 py-3">{t("history.table_folio")}</th>
              <th className="px-6 py-3 text-center">{t("history.table_term")}</th>
              <th className="px-6 py-3 text-right">{t("history.table_payment")}</th>
              <th className="px-6 py-3 text-right">{t("history.table_interest")}</th>
              <th className="px-6 py-3 text-right">{t("history.table_cost")}</th>
              <th className="px-6 py-3 text-center">{t("history.table_status")}</th>
              <th className="px-6 py-3 text-center">{t("history.table_actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {loading ? (
              <TableSkeleton rows={5} cols={7} />
            ) : simulations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-surface-400 dark:text-surface-500">
                  {t("history.empty")}
                </td>
              </tr>
            ) : (
              simulations.map((sim) => (
                <tr key={sim.simulation_id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-brand-600 dark:text-brand-400">{sim.folio}</td>
                  <td className="px-6 py-4 text-center text-surface-600 dark:text-surface-300">{sim.term_months}</td>
                  <td className="px-6 py-4 text-right font-medium text-surface-900 dark:text-surface-100">
                    {formatCurrency(sim.payment)}
                  </td>
                  <td className="px-6 py-4 text-right text-surface-600 dark:text-surface-300">
                    {formatCurrency(sim.total_interest)}
                  </td>
                  <td className="px-6 py-4 text-right text-surface-600 dark:text-surface-300">
                    {formatCurrency(sim.total_payment)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="success">{t("common.completed")}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onView(sim)}
                      disabled={disableActions}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Eye size={14} />
                      {t("simulator.view_schedule")}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
