import React, { memo } from "react";
import { cn } from "../../lib/utils";

export const Input = memo(({ label, className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{label}</label>}
    <input 
      type={type}
      className={cn(
        "w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 dark:text-surface-100 transition-all text-sm",
        type === "number" && "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        className
      )}
      {...props} 
    />
  </div>
));

Input.displayName = "Input";
