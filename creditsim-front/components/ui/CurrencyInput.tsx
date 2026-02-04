import React, { useState, useEffect, memo } from "react";
import { cn } from "../../lib/utils";
import { CurrencyInputProps } from "./types";

export const CurrencyInput = memo(({ label, value, onChange, className, placeholder }: CurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value ? value.toLocaleString("en-US") : "");
    }
  }, [value, isFocused]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setDisplayValue(value ? value.toString() : "");
    setTimeout(() => e.target.select(), 0);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numValue = parseFloat(displayValue.replace(/,/g, "")) || 0;
    onChange(numValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, "");
    setDisplayValue(inputValue);
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500">$</span>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "w-full pl-7 pr-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 dark:text-surface-100 transition-all text-sm",
            className
          )}
        />
      </div>
    </div>
  );
});

CurrencyInput.displayName = "CurrencyInput";
