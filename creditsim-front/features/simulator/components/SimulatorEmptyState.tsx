import React from "react";
import { LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";

export const SimulatorEmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="h-64 flex flex-col items-center justify-center text-surface-400 dark:text-surface-600 border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-xl bg-surface-50 dark:bg-surface-900/50">
      <LayoutDashboard size={48} className="mb-4 opacity-20" />
      <p>{t("simulator.waiting")}</p>
    </div>
  );
};
