import React, { memo } from "react";
import { cn } from "../../lib/utils";

export const Badge = memo(({ children, variant = "default" }: { children?: React.ReactNode; variant?: "success" | "warning" | "danger" | "default" }) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    default: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[variant])}>
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
