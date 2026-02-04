import React from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { CheckCircle, XCircle, Zap, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MetricCardProps } from "../types";

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  status = "neutral",
  change,
  trend,
}) => {
  const statusColors = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    error: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
    neutral: "bg-surface-50 dark:bg-surface-900 border-surface-200 dark:border-surface-800",
  };

  const StatusIcon = status === "success" ? CheckCircle : status === "error" ? XCircle : Zap;

  return (
    <Card className={`${statusColors[status]} border transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            {label}
          </span>
          <StatusIcon size={14} className="opacity-50" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-surface-900 dark:text-surface-100">{value}</span>
          {unit && <span className="text-sm text-surface-500 dark:text-surface-400">{unit}</span>}
        </div>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            {trend === "up" && <TrendingUp size={12} className="text-emerald-500" />}
            {trend === "down" && <TrendingUp size={12} className="text-rose-500 rotate-180" />}
            <span className="text-xs text-surface-600 dark:text-surface-400">{change}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
