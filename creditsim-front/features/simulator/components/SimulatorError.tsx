import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export const SimulatorError: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 border border-red-100 dark:border-red-900/50">
      <AlertTriangle size={20} /> {t("simulator.error_backend")}
    </div>
  );
};
