// src/lib/utils/exportParticipants.ts (EXCEL EXPORT WITH STYLING)
"use client";

import * as XLSX from "xlsx-js-style";
import { ParticipantWithEvent } from "@/lib/types/participants";

/**
 * ============================================
 * EXCEL EXPORT - Beautiful Styled Format
 * ============================================
 */

interface ExportOptions {
  fileName?: string;
  sheetName?: string;
}

/**
 * ✅ Export single or multiple participants to Excel
 */




export function exportParticipantsToExcel(
  participants: ParticipantWithEvent[],
  options: ExportOptions = {}
) {
  const { 
    fileName = `Participanti_${new Date().toISOString().split('T')[0]}.xlsx`,
    sheetName = "Participanți"
  } = options;

  // ✅ 1. BUILD DATA ROWS
  const rows = participants.map((p) => ({
    "📋 Titlu": p.gender || "",
    "👤 Prenume": p.prenume || "",
    "👤 Nume": p.nume || "",
    "📧 Email": p.email || "",
    "📱 Telefon": p.telefon || "",
    "🏥 Specializare": p.specializare || "",
    "👨‍💼 Tip Participant": p.tip_participant || "",
    
    // Fizica fields
    "🪪 CNP": p.cnp || "",
    "🏠 Adresă (PF)": p.adresa_pf || "",
    
    // Juridica fields
    "🏢 Denumire Firmă": p.denumire_societate || "",
    "🆔 CUI": p.cui || "",
    "📋 Reg. Comerț": p.registrul_comertului || "",
    "🏢 Sediu Social": p.sediu_social || "",
    "🏦 IBAN": p.iban || "",
    "👥 Persoană Contact": p.persoana_contact || "",
    
    // Agreements
    "📜 GDPR": p.politica_confidentialitate ? "✅ DA" : "❌ NU",
    "📜 T&C": p.termeni_conditii ? "✅ DA" : "❌ NU",
    "📧 Marketing": p.marketing_consent ? "✅ DA" : "❌ NU",
    "📸 Foto/Video": p.acord_foto_video ? "✅ DA" : "❌ NU",
    "ℹ️ Info Eveniment": p.informare_natura_eveniment ? "✅ DA" : "❌ NU",
    
    // Event & Status
    "🎯 Eveniment": p.event?.title || "",
    "📍 Locație": p.event?.location || "",
    "💰 Preț": p.event?.price ? `${p.event.price} ${p.event.currency}` : "",
    "⏳ Status": p.status || "",
    "📅 Înregistrat": new Date(p.created_at).toLocaleString("ro-RO") || "",
    "✅ Confirmat la": p.confirmed_at ? new Date(p.confirmed_at).toLocaleString("ro-RO") : "-",
  }));

  // ✅ 2. CREATE WORKBOOK
  const ws = XLSX.utils.json_to_sheet(rows);

  // ✅ 3. DEFINE STYLES
  const headerFill = { fill: { fgColor: { rgb: "FF2D9A8F" } } }; // Teal
  const headerFont = { font: { bold: true, color: { rgb: "FFFFFFFF" }, size: 11 } };
  const headerAlignment = { alignment: { horizontal: "center", vertical: "center", wrapText: true } };
  const headerStyle = { ...headerFill, ...headerFont, ...headerAlignment };

  const dataAlignment = { alignment: { horizontal: "left", vertical: "center", wrapText: true } };
  const dataBorder = {
    border: {
      left: { style: "thin", color: { rgb: "FFE2E8F0" } },
      right: { style: "thin", color: { rgb: "FFE2E8F0" } },
      top: { style: "thin", color: { rgb: "FFE2E8F0" } },
      bottom: { style: "thin", color: { rgb: "FFE2E8F0" } },
    },
  };

  const alternateRowFill = { fill: { fgColor: { rgb: "FFF8FAFC" } } }; // Light slate

  // ✅ 4. APPLY STYLES TO HEADERS
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!ws[address]) continue;
    ws[address].s = headerStyle;
  }

  // ✅ 5. APPLY STYLES TO DATA ROWS
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[address]) continue;

      // Alternate row colors
      const bgFill = R % 2 === 0 ? alternateRowFill : { fill: { fgColor: { rgb: "FFFFFFFF" } } };

      ws[address].s = {
        ...bgFill,
        ...dataAlignment,
        ...dataBorder,
        font: { size: 10, color: { rgb: "FF1E293B" } },
      };
    }
  }

  // ✅ 6. SET COLUMN WIDTHS
  ws["!cols"] = [
    { wch: 8 },   // Titlu
    { wch: 12 },  // Prenume
    { wch: 12 },  // Nume
    { wch: 20 },  // Email
    { wch: 14 },  // Telefon
    { wch: 18 },  // Specializare
    { wch: 14 },  // Tip Participant
    { wch: 14 },  // CNP
    { wch: 25 },  // Adresă
    { wch: 20 },  // Denumire Firmă
    { wch: 12 },  // CUI
    { wch: 15 },  // Reg. Comerț
    { wch: 25 },  // Sediu Social
    { wch: 24 },  // IBAN
    { wch: 18 },  // Persoană Contact
    { wch: 10 },  // GDPR
    { wch: 10 },  // T&C
    { wch: 10 },  // Marketing
    { wch: 12 },  // Foto/Video
    { wch: 14 },  // Info Eveniment
    { wch: 25 },  // Eveniment
    { wch: 20 },  // Locație
    { wch: 12 },  // Preț
    { wch: 12 },  // Status
    { wch: 20 },  // Înregistrat
    { wch: 20 },  // Confirmat la
  ];

  // ✅ 7. FREEZE FIRST ROW
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  // ✅ 8. CREATE WORKBOOK & EXPORT
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}

/**
 * ✅ Export participants for a specific event with full summary
 */
export function exportEventParticipants(
  participants: ParticipantWithEvent[],
  eventTitle: string = "Eveniment"
) {
  if (participants.length === 0) {
    throw new Error("Nu sunt participanți de exportat");
  }

  const fileName = `${eventTitle}_Participanti_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // ✅ 1. CALCULATE STATISTICS
  const totalParticipants = participants.length;
  const confirmedParticipants = participants.filter(p => p.status === "confirmed").length;
  const pendingParticipants = participants.filter(p => p.status === "pending").length;
  const attendedParticipants = participants.filter(p => p.status === "attended").length;
  const noShowParticipants = participants.filter(p => p.status === "no-show").length;
  const cancelledParticipants = participants.filter(p => p.status === "cancelled").length;
  const fiziParticipants = participants.filter(p => p.tip_participant === "Fizica").length;
  const juridiParticipants = participants.filter(p => p.tip_participant === "Juridica").length;
  
  const event = participants[0]?.event;
  const eventLocation = event?.location || "N/A";
  const eventPrice = event?.price ? `${event.price} ${event.currency}` : "N/A";

  // ✅ 2. BUILD SUMMARY SHEET DATA
  const summaryData = [
    ["", ""],
    ["📊 RAPORT PARTICIPANȚI - EVENIMENT", ""],
    ["", ""],
    ["Eveniment:", eventTitle],
    ["Locație:", eventLocation],
    ["Preț Participant:", eventPrice],
    ["Data Export:", new Date().toLocaleString("ro-RO")],
    ["", ""],
    ["📈 STATISTICI GENERALE", ""],
    ["Total Participanți:", totalParticipants],
    ["", ""],
    ["⏳ SITUAȚIE CONFIRMĂRI", ""],
    ["✅ Confirmați:", confirmedParticipants],
    ["⏳ În Așteptare:", pendingParticipants],
    ["❌ Anulați:", cancelledParticipants],
    ["", ""],
    ["🎉 PREZENȚĂ", ""],
    ["🎉 Prezenți:", attendedParticipants],
    ["⚠️ Absenti:", noShowParticipants],
    ["", ""],
    ["👥 TIP PARTICIPANT", ""],
    ["👤 Persoane Fizice:", fiziParticipants],
    ["🏢 Persoane Juridice:", juridiParticipants],
  ];

  // ✅ 3. BUILD PARTICIPANTS DATA SHEET
  const participantsData = participants.map((p) => ({
    "👤 Titlu": p.gender || "",
    "👤 Prenume": p.prenume || "",
    "👤 Nume": p.nume || "",
    "📧 Email": p.email || "",
    "📱 Telefon": p.telefon || "",
    "🏥 Specializare": p.specializare || "",
    "👨‍💼 Tip": p.tip_participant || "",
    
    // Fizica fields
    "🪪 CNP": p.cnp || "",
    "🏠 Adresă (PF)": p.adresa_pf || "",
    
    // Juridica fields
    "🏢 Firma": p.denumire_societate || "",
    "🆔 CUI": p.cui || "",
    "📋 Reg. Comerț": p.registrul_comertului || "",
    "🏢 Sediu": p.sediu_social || "",
    "🏦 IBAN": p.iban || "",
    "👥 Contact": p.persoana_contact || "",
    
    // Agreements
    "📜 GDPR": p.politica_confidentialitate ? "✅" : "❌",
    "📜 T&C": p.termeni_conditii ? "✅" : "❌",
    "📧 Marketing": p.marketing_consent ? "✅" : "❌",
    "📸 Foto/Video": p.acord_foto_video ? "✅" : "❌",
    "ℹ️ Info Eveniment": p.informare_natura_eveniment ? "✅" : "❌",
    
    // Status
    "⏳ Status": getStatusLabel(p.status),
    "📅 Înregistrat": new Date(p.created_at).toLocaleString("ro-RO") || "",
    "✅ Confirmat la": p.confirmed_at ? new Date(p.confirmed_at).toLocaleString("ro-RO") : "-",
  }));

  // ✅ 4. CREATE WORKBOOK
  const wb = XLSX.utils.book_new();

  // ✅ SHEET 1: SUMMARY
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary["!cols"] = [{ wch: 30 }, { wch: 20 }];
  
  // Style summary sheet
  const summaryRange = XLSX.utils.decode_range(wsSummary["!ref"] || "A1");
  for (let R = summaryRange.s.r; R <= summaryRange.e.r; ++R) {
    const titleCell = wsSummary[XLSX.utils.encode_cell({ r: R, c: 0 })];
    const valueCell = wsSummary[XLSX.utils.encode_cell({ r: R, c: 1 })];
    
    if (titleCell && R === 1) {
      // Main title
      titleCell.s = {
        font: { bold: true, size: 16, color: { rgb: "FF2D9A8F" } },
        alignment: { horizontal: "left", vertical: "center" },
      };
    } else if (titleCell && (R === 8 || R === 11 || R === 16 || R === 20)) {
      // Section headers
      titleCell.s = {
        font: { bold: true, size: 12, color: { rgb: "FF2D9A8F" } },
        alignment: { horizontal: "left", vertical: "center" },
        fill: { fgColor: { rgb: "FFF0F9F8" } },
      };
    } else if (titleCell && R > 1 && R !== 2) {
      // Data labels
      titleCell.s = {
        font: { bold: true, size: 11, color: { rgb: "FF1E293B" } },
        alignment: { horizontal: "left", vertical: "center" },
      };
      
      if (valueCell) {
        valueCell.s = {
          font: { bold: true, size: 11, color: { rgb: "FF2D9A8F" } },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "FFFEF2F2" } },
        };
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, wsSummary, "Rezumat");

  // ✅ SHEET 2: DETAILED PARTICIPANTS
  const wsParticipants = XLSX.utils.json_to_sheet(participantsData);

  // Apply styles to detailed sheet
  const detailedRange = XLSX.utils.decode_range(wsParticipants["!ref"] || "A1");
  
  // Header style
  for (let C = detailedRange.s.c; C <= detailedRange.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (wsParticipants[address]) {
      wsParticipants[address].s = {
        fill: { fgColor: { rgb: "FF2D9A8F" } },
        font: { bold: true, color: { rgb: "FFFFFFFF" }, size: 10 },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
      };
    }
  }

  // Data rows
  for (let R = detailedRange.s.r + 1; R <= detailedRange.e.r; ++R) {
    for (let C = detailedRange.s.c; C <= detailedRange.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: R, c: C });
      if (wsParticipants[address]) {
        wsParticipants[address].s = {
          fill: R % 2 === 0 ? { fgColor: { rgb: "FFF8FAFC" } } : { fgColor: { rgb: "FFFFFFFF" } },
          alignment: { horizontal: "left", vertical: "center", wrapText: true },
          border: {
            left: { style: "thin", color: { rgb: "FFE2E8F0" } },
            right: { style: "thin", color: { rgb: "FFE2E8F0" } },
            top: { style: "thin", color: { rgb: "FFE2E8F0" } },
            bottom: { style: "thin", color: { rgb: "FFE2E8F0" } },
          },
          font: { size: 9, color: { rgb: "FF1E293B" } },
        };
      }
    }
  }

  wsParticipants["!cols"] = [
    { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 14 }, { wch: 18 },
    { wch: 8 }, { wch: 14 }, { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 15 },
    { wch: 20 }, { wch: 20 }, { wch: 16 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 20 }, { wch: 20 }
  ];

  wsParticipants["!freeze"] = { xSplit: 0, ySplit: 1 };
  XLSX.utils.book_append_sheet(wb, wsParticipants, "Participanți");

  // ✅ EXPORT
  XLSX.writeFile(wb, fileName);
}

/**
 * ✅ Helper function to get status label
 */
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "⏳ Așteptând",
    confirmed: "✅ Confirmat",
    attended: "🎉 Prezent",
    "no-show": "⚠️ Absent",
    cancelled: "❌ Anulat",
  };
  return labels[status] || status;
}

/**
 * ✅ Export multiple participants with summary sheet (Legacy)
 */
export function exportParticipantsWithSummary(
  participants: ParticipantWithEvent[],
  eventTitle: string = "Eveniment"
) {
  const fileName = `${eventTitle}_Participanti_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // ✅ 1. SUMMARY STATS
  const totalParticipants = participants.length;
  const confirmedParticipants = participants.filter(p => p.status === "confirmed").length;
  const pendingParticipants = participants.filter(p => p.status === "pending").length;
  const fiziParticipants = participants.filter(p => p.tip_participant === "Fizica").length;
  const juridiParticipants = participants.filter(p => p.tip_participant === "Juridica").length;

  // ✅ 2. SUMMARY DATA
  const summaryData = [
    ["📊 RAPORT PARTICIPANȚI", ""],
    ["", ""],
    ["Denumire Eveniment:", eventTitle],
    ["Data Export:", new Date().toLocaleString("ro-RO")],
    ["", ""],
    ["📈 STATISTICI", ""],
    ["Total Participanți:", totalParticipants],
    ["✅ Confirmați:", confirmedParticipants],
    ["⏳ În Așteptare:", pendingParticipants],
    ["👤 Persoane Fizice:", fiziParticipants],
    ["🏢 Persoane Juridice:", juridiParticipants],
  ];

  // ✅ 3. PARTICIPANTS DATA
  const participantsData = participants.map((p) => [
    p.gender || "",
    p.prenume || "",
    p.nume || "",
    p.email || "",
    p.telefon || "",
    p.specializare || "",
    p.tip_participant || "",
    p.cnp || "",
    p.adresa_pf || "",
    p.denumire_societate || "",
    p.cui || "",
    p.registrul_comertului || "",
    p.sediu_social || "",
    p.iban || "",
    p.persoana_contact || "",
    p.politica_confidentialitate ? "✅" : "❌",
    p.termeni_conditii ? "✅" : "❌",
    p.marketing_consent ? "✅" : "❌",
    p.acord_foto_video ? "✅" : "❌",
    p.informare_natura_eveniment ? "✅" : "❌",
    p.event?.title || "",
    p.event?.location || "",
    p.event?.price ? `${p.event.price} ${p.event.currency}` : "",
    p.status || "",
    new Date(p.created_at).toLocaleString("ro-RO") || "",
    p.confirmed_at ? new Date(p.confirmed_at).toLocaleString("ro-RO") : "-",
  ]);

  // ✅ 4. CREATE WORKBOOK
  const wb = XLSX.utils.book_new();

  // ✅ SHEET 1: SUMMARY
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary["!cols"] = [{ wch: 25 }, { wch: 20 }];
  
  // Style summary sheet
  const summaryRange = XLSX.utils.decode_range(wsSummary["!ref"] || "A1");
  for (let R = summaryRange.s.r; R <= summaryRange.e.r; ++R) {
    const titleCell = wsSummary[XLSX.utils.encode_cell({ r: R, c: 0 })];
    if (titleCell && (R === 0 || R === 5)) {
      titleCell.s = {
        font: { bold: true, size: 14, color: { rgb: "FF2D9A8F" } },
        alignment: { horizontal: "left", vertical: "center" },
      };
    } else if (R > 5) {
      const cell = wsSummary[XLSX.utils.encode_cell({ r: R, c: 0 })];
      if (cell) {
        cell.s = {
          font: { bold: true, size: 11 },
          alignment: { horizontal: "left", vertical: "center" },
        };
      }
      const valueCell = wsSummary[XLSX.utils.encode_cell({ r: R, c: 1 })];
      if (valueCell) {
        valueCell.s = {
          font: { size: 11, color: { rgb: "FF2D9A8F" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, wsSummary, "Rezumat");

  // ✅ SHEET 2: DETAILED PARTICIPANTS
  const wsParticipants = XLSX.utils.aoa_to_sheet([
    [
      "Titlu", "Prenume", "Nume", "Email", "Telefon", "Specializare", "Tip",
      "CNP", "Adresă (PF)", "Firma", "CUI", "Reg. Com.", "Sediu", "IBAN", "Contact",
      "GDPR", "T&C", "MKT", "Foto", "Info", "Eveniment", "Locație", "Preț", "Status", "Înregistrat", "Confirmat"
    ],
    ...participantsData,
  ]);

  wsParticipants["!cols"] = [
    { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 14 }, { wch: 18 },
    { wch: 14 }, { wch: 14 }, { wch: 25 }, { wch: 20 }, { wch: 12 }, { wch: 15 },
    { wch: 25 }, { wch: 24 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    { wch: 12 }, { wch: 14 }, { wch: 25 }, { wch: 20 }, { wch: 12 }, { wch: 12 },
    { wch: 20 }, { wch: 20 }
  ];

  // Style header row
  const headerRange = XLSX.utils.decode_range(wsParticipants["!ref"] || "A1");
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (wsParticipants[address]) {
      wsParticipants[address].s = {
        fill: { fgColor: { rgb: "FF2D9A8F" } },
        font: { bold: true, color: { rgb: "FFFFFFFF" }, size: 11 },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
      };
    }
  }

  // Alternate row colors for data
  for (let R = 1; R <= headerRange.e.r; ++R) {
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: R, c: C });
      if (wsParticipants[address]) {
        wsParticipants[address].s = {
          fill: R % 2 === 0 ? { fgColor: { rgb: "FFF8FAFC" } } : { fgColor: { rgb: "FFFFFFFF" } },
          alignment: { horizontal: "left", vertical: "center", wrapText: true },
          border: {
            left: { style: "thin", color: { rgb: "FFE2E8F0" } },
            right: { style: "thin", color: { rgb: "FFE2E8F0" } },
            top: { style: "thin", color: { rgb: "FFE2E8F0" } },
            bottom: { style: "thin", color: { rgb: "FFE2E8F0" } },
          },
          font: { size: 10, color: { rgb: "FF1E293B" } },
        };
      }
    }
  }

  wsParticipants["!freeze"] = { xSplit: 0, ySplit: 1 };
  XLSX.utils.book_append_sheet(wb, wsParticipants, "Participanți");

  // ✅ EXPORT
  XLSX.writeFile(wb, fileName);
}


/**
 * ✅ Export minimal: Gen, Nume, Prenume, Telefon, Tip
 */
export function exportParticipantsMinimal(
  participants: ParticipantWithEvent[],
  eventTitle: string = "Lista"
) {
  const fileName = `Lista_Simpla_${eventTitle}_${new Date().toISOString().split('T')[0]}.xlsx`;

  const rows = participants.map((p) => ({
    "Gen": p.gender || "",
    "Nume": p.nume || "",
    "Prenume": p.prenume || "",
    "Telefon": p.telefon || "",
    "Tip Persoana": p.tip_participant || "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  
  // Styling rapid pentru header
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!ws[address]) continue;
    ws[address].s = {
      fill: { fgColor: { rgb: "FF334155" } }, // Slate 700
      font: { bold: true, color: { rgb: "FFFFFFFF" } },
      alignment: { horizontal: "center" }
    };
  }

  ws["!cols"] = [{ wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Lista Simpla");
  XLSX.writeFile(wb, fileName);
}