import React from "react";
import { Button } from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";

type HistoryHeaderProps = {
  loading: boolean;
  onRefresh: () => void;
};

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({ loading, onRefresh }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">{t("history.title")}</h2>
        <p className="text-surface-500 dark:text-surface-400">{t("history.subtitle")}</p>
      </div>
      <Button onClick={onRefresh} variant="outline" isLoading={loading}>
        {t("common.refresh")}
      </Button>
    </div>
  );
};
