import React, { memo } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { ButtonProps } from "./types";

export const Button = memo(({ 
  children, 
  onClick, 
  variant = "primary", 
  isLoading = false,
  className,
  type = "button",
  disabled
}: ButtonProps) => {
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 shadow-sm",
    secondary: "bg-surface-800 text-white hover:bg-surface-900 dark:bg-surface-700 dark:hover:bg-surface-600 shadow-sm",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50",
    outline: "bg-white text-surface-700 border border-surface-300 hover:bg-surface-50 dark:bg-surface-900 dark:text-surface-200 dark:border-surface-700 dark:hover:bg-surface-800",
    ghost: "bg-transparent text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800",
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={isLoading || disabled}
      className={cn(
        "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2",
        variants[variant],
        (isLoading || disabled) && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      {isLoading && <Loader2 className="animate-spin" size={16} />}
      {children}
    </button>
  );
});

Button.displayName = "Button";
