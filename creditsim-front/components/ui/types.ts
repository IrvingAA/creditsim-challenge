import { ReactNode } from "react";

// UI Component Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  isLoading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export interface SkeletonProps {
  className?: string;
}

export interface CurrencyInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
}

export interface PercentageInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
}

export interface AutoFitTextProps {
  text: string;
  className?: string;
  maxFontPx?: number;
  minFontPx?: number;
  precisionPx?: number;
  allowWrapOnMin?: boolean;
}
