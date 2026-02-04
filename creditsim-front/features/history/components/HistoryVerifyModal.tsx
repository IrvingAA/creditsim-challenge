import React from "react";
import { Modal } from "../../../components/ui/Modal";
import { ScheduleTableSkeleton } from "../../../components/ui/Skeleton";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../lib/currency";
import { SimulationResult } from "../../../domain/types";
import { Button } from "../../../components/ui/Button";
import { Download } from "lucide-react";
import { downloadSimulationPdf } from "../../../lib/pdf";
import { HistoryVerifyModalProps } from "../types";

export const HistoryVerifyModal: React.FC<HistoryVerifyModalProps> = ({
  isOpen,
  onClose,
  selectedSim,
  verifiedSim,
  verifying,
  verifyError,
}) => {
  const { t } = useTranslation();
  const canDownload = Boolean(verifiedSim);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("history.verify_title")} size="lg">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => verifiedSim && downloadSimulationPdf(verifiedSim, t)}
            disabled={!canDownload}
          >
            <Download size={16} />
            {t("simulator.download_pdf")}
          </Button>
        </div>
        <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50/60 dark:bg-surface-900/40 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-md bg-white/80 dark:bg-surface-950/60 border border-surface-200 dark:border-surface-800 px-3 py-2">
              <p className="text-surface-500 dark:text-surface-400">{t("history.table_folio")}</p>
              <p className="font-mono text-surface-900 dark:text-surface-100">{selectedSim?.folio}</p>
            </div>
            <div className="rounded-md bg-white/80 dark:bg-surface-950/60 border border-surface-200 dark:border-surface-800 px-3 py-2">
              <p className="text-surface-500 dark:text-surface-400">{t("history.table_term")}</p>
              <p className="text-surface-900 dark:text-surface-100">{selectedSim?.term_months}</p>
            </div>
            <div className="rounded-md bg-white/80 dark:bg-surface-950/60 border border-surface-200 dark:border-surface-800 px-3 py-2">
              <p className="text-surface-500 dark:text-surface-400">{t("history.table_payment")}</p>
              <p className="text-surface-900 dark:text-surface-100">{formatCurrency(selectedSim?.payment ?? 0)}</p>
            </div>
            <div className="rounded-md bg-white/80 dark:bg-surface-950/60 border border-surface-200 dark:border-surface-800 px-3 py-2">
              <p className="text-surface-500 dark:text-surface-400">{t("history.table_cost")}</p>
              <p className="text-surface-900 dark:text-surface-100">{formatCurrency(selectedSim?.total_payment ?? 0)}</p>
            </div>
          </div>
          {verifyError && (
            <div className="mt-3 text-sm text-red-600 dark:text-red-400">{verifyError}</div>
          )}
        </div>

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
              {verifying ? (
                <ScheduleTableSkeleton rows={12} />
              ) : verifiedSim?.schedule ? (
                verifiedSim.schedule.map((row) => (
                  <tr key={row.period} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    <td className="px-4 py-2 text-center font-mono text-surface-600 dark:text-surface-400">{row.period}</td>
                    <td className="px-4 py-2 text-right font-medium text-surface-900 dark:text-surface-100">{formatCurrency(row.payment)}</td>
                    <td className="px-4 py-2 text-right text-surface-600 dark:text-surface-300">{formatCurrency(row.interest)}</td>
                    <td className="px-4 py-2 text-right text-surface-600 dark:text-surface-300">{formatCurrency(row.principal)}</td>
                    <td className="px-4 py-2 text-right font-mono text-surface-900 dark:text-surface-100">{formatCurrency(row.balance)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-surface-400 dark:text-surface-500">
                    {t("common.no_data")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
