import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSimulationHistory } from "../../hooks/useSimulationHistory";
import { SimulationResult } from "../../domain/types";
import { SimulationService } from "../../infrastructure/api";
import { HistoryHeader } from "./components/HistoryHeader";
import { HistoryPagination } from "./components/HistoryPagination";
import { HistoryTable } from "./components/HistoryTable";
import { HistoryVerifyModal } from "./components/HistoryVerifyModal";

export const HistoryFeature = () => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(0);
  const offset = page * pageSize;
  const { simulations, total, loading, refresh } = useSimulationHistory(pageSize, offset);
  const [selectedSim, setSelectedSim] = useState<SimulationResult | null>(null);
  const [verifiedSim, setVerifiedSim] = useState<SimulationResult | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const openVerifyModal = (sim: SimulationResult) => {
    setSelectedSim(sim);
    setVerifiedSim(null);
    setVerifyError(null);
  };

  const closeVerifyModal = () => {
    setSelectedSim(null);
    setVerifiedSim(null);
    setVerifyError(null);
    setVerifying(false);
  };

  const handleVerify = async (sim: SimulationResult) => {
    setVerifying(true);
    setVerifyError(null);
    try {
      const payload = {
        folio: sim.folio,
        ...(sim.last_name ? { last_name: sim.last_name } : {}),
        ...(sim.document_id ? { document_id: sim.document_id } : {}),
      };
      const result = await SimulationService.verify(sim.simulation_id, payload);
      setVerifiedSim(result);
    } catch (err) {
      console.error("Failed to verify simulation:", err);
      if (sim.last_name && !sim.document_id) {
        setVerifyError(t("history.verify_missing_identity"));
      } else {
        setVerifyError(t("history.verify_error"));
      }
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (!selectedSim) return;
    void handleVerify(selectedSim);
  }, [selectedSim]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);
  const startRow = total === 0 ? 0 : offset + 1;
  const endRow = total === 0 ? 0 : Math.min(offset + simulations.length, total);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, page]);

  return (
    <div className="space-y-6">
      <HistoryHeader loading={loading} onRefresh={refresh} />

      <HistoryTable
        simulations={simulations}
        loading={loading}
        onView={openVerifyModal}
        disableActions={verifying}
      />

      <HistoryPagination
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        startRow={startRow}
        endRow={endRow}
        loading={loading}
        onPageChange={setPage}
        onPageSizeChange={(nextSize) => {
          setPageSize(nextSize);
          setPage(0);
        }}
      />

      <HistoryVerifyModal
        isOpen={selectedSim !== null}
        onClose={closeVerifyModal}
        selectedSim={selectedSim}
        verifiedSim={verifiedSim}
        verifying={verifying}
        verifyError={verifyError}
      />
    </div>
  );
};
