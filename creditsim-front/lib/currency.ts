export const parseDecimal = (value: string | number): number => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const cleaned = String(value).replace(/[^0-9.-]+/g, "");
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (value: string | number): string => {
  const num = parseDecimal(value);
  const formatted = num.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  return `$${formatted}`;
};
