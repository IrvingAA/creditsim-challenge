import React, { memo, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { ModalProps } from "./types";

export const Modal = memo(({ isOpen, onClose, title, children, size = "md" }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div className={cn(
        "relative w-full mx-4 bg-white dark:bg-surface-900 rounded-xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 fade-in duration-200",
        sizes[size]
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-800">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = "Modal";
