
import React, { useState } from "react";
import { Header } from "./components/layout/Header";
import { SimulatorFeature } from "./features/simulator/SimulatorFeature";
import { HistoryFeature } from "./features/history/HistoryFeature";
import { BenchmarkFeature } from "./features/benchmark/BenchmarkFeatureV2";

export const App = () => {
  const [activeTab, setActiveTab] = useState<"simulate" | "history" | "benchmark">("simulate");

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20 transition-colors duration-300">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === "simulate" && <SimulatorFeature />}
          {activeTab === "history" && <HistoryFeature />}
          {activeTab === "benchmark" && <BenchmarkFeature />}
        </div>
      </main>
    </div>
  );
};
