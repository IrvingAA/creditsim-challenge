import React from "react";
import { Button } from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";

type HistoryPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  startRow: number;
  endRow: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const HistoryPagination: React.FC<HistoryPaginationProps> = ({
  page,
  pageSize,
  total,
  totalPages,
  startRow,
  endRow,
  loading,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-surface-500 dark:text-surface-400">
      <div>
        {t("history.pagination_status", {
          start: startRow,
          end: endRow,
          total,
        })}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs">{t("history.per_page")}</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1 text-xs bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 text-surface-700 dark:text-surface-200"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0 || loading}
        >
          {t("history.prev")}
        </Button>
        <span className="text-xs text-surface-500 dark:text-surface-400">
          {t("history.page_of", { page: page + 1, total: totalPages })}
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page + 1 >= totalPages || loading}
        >
          {t("history.next")}
        </Button>
      </div>
    </div>
  );
};
