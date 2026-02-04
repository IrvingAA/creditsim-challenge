
import React from "react";
import { Calculator, History, Activity, Sun, Moon, Languages } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../lib/theme-provider";
import { useTranslation } from "react-i18next";
import { HeaderProps, NavItemProps } from "./types";

const NavItem = (props: NavItemProps) => {
  const { id, label, icon: Icon, isActive, onClick } = props;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
        isActive
          ? "border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400" 
          : "border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:border-surface-300 dark:hover:border-surface-700"
      )}
    >
      <Icon size={16} />
      {label}
    </button>
  );
};

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language || "en";
    const newLang = currentLang.startsWith("es") ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 sticky top-0 z-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-200 dark:shadow-none">
              C
            </div>
            <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100 tracking-tight">{t("header.title")} <span className="text-surface-400 dark:text-surface-600 font-normal">{t("header.subtitle")}</span></h1>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 dark:text-surface-300 mr-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              {t("header.operational")}
            </span>
            
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors flex items-center gap-1 font-semibold text-xs uppercase"
              title="Change Language"
            >
              <Languages size={18} />
              <span>{(i18n.language || "en").split('-')[0]}</span>
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-1 overflow-x-auto no-scrollbar">
          <NavItem id="simulate" label={t("header.simulator")} icon={Calculator} isActive={activeTab === "simulate"} onClick={() => setActiveTab("simulate")} />
          <NavItem id="history" label={t("header.history")} icon={History} isActive={activeTab === "history"} onClick={() => setActiveTab("history")} />
          <NavItem id="benchmark" label={t("header.benchmark")} icon={Activity} isActive={activeTab === "benchmark"} onClick={() => setActiveTab("benchmark")} />
        </div>
      </div>
    </header>
  );
};
