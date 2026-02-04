export const DEFAULT_LOAN_VALUES = {
  PRINCIPAL: 100000,
  ANNUAL_RATE: 0.12,
  TERM_MONTHS: 12,
} as const;

export const API_CONFIG = {
  TIMEOUT: 10000,
  DEFAULT_BASE_URL: "http://localhost:8105",
} as const;

export const THEME_CONFIG = {
  STORAGE_KEY: "creditsim-ui-theme",
  DEFAULT_THEME: "light" as const,
} as const;
