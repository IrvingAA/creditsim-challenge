import React from "react";

// Layout component types
export interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: "simulate" | "history" | "benchmark") => void;
}

export interface NavItemProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  onClick: () => void;
}
