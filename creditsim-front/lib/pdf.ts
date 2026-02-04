import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { SimulationResult } from "../domain/types";
import { formatCurrency } from "./currency";

type TranslateFn = (key: string) => string;

const formatRate = (value: string | number) => {
  const rateNum = Number(value);
  if (!Number.isFinite(rateNum)) return "-";
  const percent = rateNum <= 1 ? rateNum * 100 : rateNum;
  return `${percent.toFixed(2)}%`;
};

export const downloadSimulationPdf = (result: SimulationResult, t: TranslateFn) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 40;
  let y = 40;

  const title = t("simulator.report_title");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, marginX, y);
  y += 20;

  const createdAt = result.created_at ? new Date(result.created_at) : new Date();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`${t("simulator.report_generated")}: ${createdAt.toLocaleString()}`, marginX, y);
  y += 16;

  const addSection = (sectionTitle: string, rows: Array<[string, string]>) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(sectionTitle, marginX, y);
    y += 6;

    autoTable(doc, {
      startY: y + 6,
      theme: "grid",
      body: rows,
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 160 },
        1: { cellWidth: 320 },
      },
      margin: { left: marginX, right: marginX },
    });

    // @ts-expect-error jspdf-autotable adds lastAutoTable
    y = (doc.lastAutoTable?.finalY || y) + 16;
  };

  const detailRows: Array<[string, string]> = [
    [t("simulator.folio"), result.folio],
    [t("simulator.id"), result.simulation_id],
    [t("simulator.created_at"), createdAt.toLocaleString()],
  ];

  if (result.name) {
    detailRows.push([t("simulator.borrower"), `${result.name} ${result.last_name || ""}`.trim()]);
  }
  if (result.document_id) {
    detailRows.push([t("simulator.document"), result.document_id]);
  }

  addSection(t("simulator.details"), detailRows);

  addSection(t("simulator.card_params"), [
    [t("simulator.principal"), formatCurrency(result.principal)],
    [t("simulator.rate"), formatRate(result.annual_rate)],
    [t("simulator.term"), `${result.term_months}`],
  ]);

  addSection(t("simulator.report_totals"), [
    [t("simulator.monthly_payment"), formatCurrency(result.payment)],
    [t("simulator.total_interest"), formatCurrency(result.total_interest)],
    [t("simulator.total_cost"), formatCurrency(result.total_payment)],
  ]);

  const schedule = result.schedule || [];
  if (schedule.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(t("simulator.schedule_title"), marginX, y);
    y += 6;

    autoTable(doc, {
      startY: y + 6,
      theme: "striped",
      head: [[
        t("simulator.period"),
        t("simulator.payment"),
        t("simulator.interest"),
        t("simulator.principal_col"),
        t("simulator.balance"),
      ]],
      body: schedule.map((row) => [
        `${row.period}`,
        formatCurrency(row.payment),
        formatCurrency(row.interest),
        formatCurrency(row.principal),
        formatCurrency(row.balance),
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255] },
      margin: { left: marginX, right: marginX },
    });
  }

  const fileSafe = (result.folio || result.simulation_id || "simulation").replace(/[^a-z0-9-_]+/gi, "_");
  doc.save(`creditsim_${fileSafe}.pdf`);
};
