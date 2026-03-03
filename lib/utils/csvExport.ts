// src/lib/utils/xlsxExport.ts
import * as XLSX from "xlsx-js-style";
import type { EnhancedEvent } from "@/lib/types/events";

const FONT_FAMILY = "Trebuchet MS";
const FONT_SIZE_BODY = 14;
const FONT_SIZE_HEADER = 14;

// --- STIL BORDURĂ PROFESIONALĂ ---
const BORDER_STYLE = {
  top: { style: "thin", color: { rgb: "CBD5E1" } },    // Slate-300
  bottom: { style: "thin", color: { rgb: "CBD5E1" } },
  left: { style: "thin", color: { rgb: "CBD5E1" } },
  right: { style: "thin", color: { rgb: "CBD5E1" } },
};

const HEADER_STYLE = {
  font: { bold: true, color: { rgb: "FFFFFF" }, sz: FONT_SIZE_HEADER, name: FONT_FAMILY },
  fill: { fgColor: { rgb: "2D9A8F" } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: {
    ...BORDER_STYLE,
    bottom: { style: "medium", color: { rgb: "000000" } }, // Linie mai groasă sub header
  },
} as const;

const ROW_STRIPE_STYLE = {
  fill: { fgColor: { rgb: "F1F5F9" } },
};

export function exportEventsToCSV(
  events: EnhancedEvent[],
  filenamePrefix = "Raport_Managerial"
): void {
  if (!events?.length) return;

  try {
    const data = events.map((event) => {
      const participants = event.stats?.totalParticipants ?? 0;
      const occupancy = event.stats?.occupancyRate ?? 0;
      const revenue = participants * event.price;

      return {
        "DENUMIRE EVENIMENT": event.title?.toUpperCase() ?? "",
        "DESCRIERE DETALIATĂ": event.description || "—",
        "STATUS": event.status?.toUpperCase() ?? "—",
        "LOCAȚIE": event.location ?? "—",
        "START": new Date(event.start_date).toLocaleString("ro-RO"),
        "FINAL": new Date(event.end_date).toLocaleString("ro-RO"),
        "PREȚ": `${event.price.toFixed(2)} ${event.currency}`,
        "ÎNSCRIȘI": participants,
        "CAPACITATE": event.max_participants,
        "OCUPARE (%)": `${occupancy}%`,
        "VENIT ESTIMAT": `${revenue.toFixed(2)} ${event.currency}`,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Lățimi coloane
    worksheet["!cols"] = [
      { wch: 35 }, { wch: 45 }, { wch: 15 }, { wch: 25 }, { wch: 22 }, 
      { wch: 22 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 20 }
    ];

    const range = XLSX.utils.decode_range(worksheet["!ref"]!);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellRef]) continue;

        // Stil de bază + BORDURI pentru fiecare celulă
        worksheet[cellRef].s = {
          font: { sz: FONT_SIZE_BODY, name: FONT_FAMILY },
          alignment: { vertical: "center", wrapText: C === 0 || C === 1 },
          border: BORDER_STYLE, // Aplicăm liniile de sub tabel
        };

        if (R === 0) {
          worksheet[cellRef].s = HEADER_STYLE;
        } else {
          if (R % 2 === 0) {
            worksheet[cellRef].s.fill = ROW_STRIPE_STYLE.fill;
          }
          
          // Aliniere dreapta pentru cifre/bani
          if (C >= 6) {
            worksheet[cellRef].s.alignment = { ...worksheet[cellRef].s.alignment, horizontal: "right" };
          }
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Evenimente");

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${filenamePrefix}_${dateStr}.xlsx`);

  } catch (err) {
    console.error("Eroare export:", err);
  }
}