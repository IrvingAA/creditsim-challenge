import React, { memo } from "react";
import { cn } from "../../lib/utils";

export const Card = memo(({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden transition-colors", className)}>
    {children}
  </div>
));

Card.displayName = "Card";

export const CardHeader = memo(({ 
  title, 
  description, 
  icon: Icon, 
  className 
}: { 
  title: string; 
  description?: string; 
  icon?: React.ElementType; 
  className?: string 
}) => (
  <div className={cn("px-6 py-4 border-b border-surface-100 dark:border-surface-800 flex items-start space-x-4", className)}>
    {Icon && <div className="p-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg"><Icon size={20} /></div>}
    <div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">{title}</h3>
      {description && <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{description}</p>}
    </div>
  </div>
));

CardHeader.displayName = "CardHeader";

export const CardContent = memo(({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn("p-6 text-surface-900 dark:text-surface-100", className)}>{children}</div>
));

CardContent.displayName = "CardContent";
