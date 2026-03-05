import * as XLSX from "xlsx-js-style";
import type { ChartsData } from "@/src/server/actions/charts";

const S = {
  headerDark: {
    fill: { fgColor: { rgb: "0F172A" } },
    font: { color: { rgb: "FFFFFF" }, bold: true, sz: 11 },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "6366F1" } },
      bottom: { style: "medium", color: { rgb: "6366F1" } },
      left: { style: "thin", color: { rgb: "6366F1" } },
      right: { style: "thin", color: { rgb: "6366F1" } },
    },
  },
  cell: {
    font: { sz: 10 },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      left: { style: "thin", color: { rgb: "E2E8F0" } },
      right: { style: "thin", color: { rgb: "E2E8F0" } },
    },
  },
  cellAlt: {
    fill: { fgColor: { rgb: "F8FAFF" } },
    font: { sz: 10 },
    alignment: { horizontal: "left", vertical: "center" },
    border: {
      bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      left: { style: "thin", color: { rgb: "E2E8F0" } },
      right: { style: "thin", color: { rgb: "E2E8F0" } },
    },
  },
  title: {
    font: { bold: true, sz: 16, color: { rgb: "6366F1" } },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "EEF2FF" } },
  },
  subtitle: {
    font: { sz: 10, italic: true, color: { rgb: "94A3B8" } },
    alignment: { horizontal: "center" },
  },
  total: {
    fill: { fgColor: { rgb: "EEF2FF" } },
    font: { bold: true, sz: 10, color: { rgb: "4338CA" } },
    alignment: { horizontal: "right" },
    border: { top: { style: "medium", color: { rgb: "6366F1" } } },
  },
  badge_green: { fill: { fgColor: { rgb: "D1FAE5" } }, font: { bold: true, sz: 10, color: { rgb: "065F46" } }, alignment: { horizontal: "center" } },
  badge_red:   { fill: { fgColor: { rgb: "FEE2E2" } }, font: { bold: true, sz: 10, color: { rgb: "991B1B" } }, alignment: { horizontal: "center" } },
  badge_blue:  { fill: { fgColor: { rgb: "DBEAFE" } }, font: { bold: true, sz: 10, color: { rgb: "1E40AF" } }, alignment: { horizontal: "center" } },
  badge_amber: { fill: { fgColor: { rgb: "FEF3C7" } }, font: { bold: true, sz: 10, color: { rgb: "92400E" } }, alignment: { horizontal: "center" } },
};

function makeSheet(
  headers: string[],
  rows: (string | number)[][],
  title: string,
  colWidths: number[]
): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const totalCols = headers.length;

  // Rând 0: titlu
  ws["A1"] = { v: title, t: "s", s: S.title };
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }];

  // Rând 1: subtitle
  ws["A2"] = {
    v: `Generat: ${new Date().toLocaleString("ro-RO")} · ${rows.length} înregistrări`,
    t: "s", s: S.subtitle,
  };
  ws["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } });

  // Rând 2: headers
  headers.forEach((h, c) => {
    ws[XLSX.utils.encode_cell({ r: 2, c })] = { v: h, t: "s", s: S.headerDark };
  });

  // Rânduri date (de la R3)
  rows.forEach((row, ri) => {
    row.forEach((val, ci) => {
      const addr = XLSX.utils.encode_cell({ r: ri + 3, c: ci });
      ws[addr] = { v: val, t: typeof val === "number" ? "n" : "s", s: ri % 2 === 0 ? S.cell : S.cellAlt };
    });
  });

  // Rând total pentru coloane numerice
  if (rows.length > 1) {
    headers.forEach((_, ci) => {
      const addr = XLSX.utils.encode_cell({ r: rows.length + 3, c: ci });
      const nums = rows.map((r) => r[ci]).filter((v) => typeof v === "number") as number[];
      ws[addr] = nums.length > 0
        ? { v: nums.reduce((a, b) => a + b, 0), t: "n", s: S.total }
        : { v: ci === 0 ? "TOTAL" : "", t: "s", s: S.total };
    });
  }

  ws["!ref"] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length + 4, c: totalCols - 1 } });
  ws["!cols"] = colWidths.map((w) => ({ wch: w }));
  ws["!rows"] = [{ hpt: 32 }, { hpt: 18 }, { hpt: 22 }];
  return ws;
}

function makeSummarySheet(data: ChartsData): XLSX.WorkSheet {
  const m = data.advancedMetrics;
  const ws: XLSX.WorkSheet = {};

  ws["A1"] = { v: "📊 SUMAR ANALYTICS", t: "s", s: { ...S.title, font: { ...S.title.font, sz: 18 } } };
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
  ws["A2"] = { v: `Interval: ${data.meta.days} zile · ${new Date(data.meta.generatedAt).toLocaleString("ro-RO")}`, t: "s", s: S.subtitle };
  ws["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 3 } });

  ["Metrică", "Valoare", "Status", "Notă"].forEach((h, c) => {
    ws[XLSX.utils.encode_cell({ r: 2, c })] = { v: h, t: "s", s: S.headerDark };
  });

  const NOTES: Record<string, string> = {
    "Risc Abandon (%)": "Sub 10% = excelent",
    "Rată Prezență (%)": "Peste 50% = bun",
    "Fill Rate Mediu (%)": "Peste 70% = bun",
    "No-Show Rate (%)": "Sub 15% = acceptabil",
    "Timp Confirmare (ore)": "Sub 24h = optim",
    "Creștere (%)": "Față de perioada anterioară",
  };

  const metrics: [string, string | number, typeof S.badge_green][] = [
    ["Total Înregistrări", m.totalRegistrations, S.badge_blue],
    ["Total Evenimente", m.totalEvents, S.badge_blue],
    ["Creștere (%)", `${m.growthRate > 0 ? "+" : ""}${m.growthRate}%`, m.growthRate >= 0 ? S.badge_green : S.badge_red],
    ["Venit Total (RON)", m.totalRevenue, S.badge_green],
    ["Preț Mediu (RON)", m.avgPrice, S.badge_blue],
    ["Rată Prezență (%)", `${m.avgAttendance}%`, m.avgAttendance >= 50 ? S.badge_green : S.badge_amber],
    ["Fill Rate Mediu (%)", `${m.avgFillRate}%`, m.avgFillRate >= 70 ? S.badge_green : S.badge_amber],
    ["Risc Abandon (%)", `${m.churnRisk}%`, m.churnRisk <= 10 ? S.badge_green : S.badge_red],
    ["Rată Retenție (%)", `${m.retentionRate}%`, m.retentionRate >= 85 ? S.badge_green : S.badge_amber],
    ["No-Show Rate (%)", `${m.noShowRate}%`, m.noShowRate <= 15 ? S.badge_green : S.badge_red],
    ["Timp Confirmare (ore)", `${m.avgTimeToConfirm}h`, m.avgTimeToConfirm <= 24 ? S.badge_green : S.badge_amber],
    ["Vârf Activitate", m.peakDay, S.badge_blue],
    ["Locație Populară", m.mostPopularLocation, S.badge_blue],
    ["Acțiuni Audit", m.totalAuditActions, S.badge_blue],
    ["Notificări Necitite", m.unreadNotifications, m.unreadNotifications === 0 ? S.badge_green : S.badge_amber],
  ];

  metrics.forEach(([label, value, badge], i) => {
    const r = i + 3;
    ws[XLSX.utils.encode_cell({ r, c: 0 })] = { v: label, t: "s", s: i % 2 === 0 ? S.cell : S.cellAlt };
    ws[XLSX.utils.encode_cell({ r, c: 1 })] = { v: value, t: "s", s: badge };
    ws[XLSX.utils.encode_cell({ r, c: 2 })] = {
      v: badge === S.badge_green ? "✅ Bun" : badge === S.badge_red ? "⚠️ Atenție" : "ℹ️ Info",
      t: "s", s: badge,
    };
    ws[XLSX.utils.encode_cell({ r, c: 3 })] = { v: NOTES[label] ?? "—", t: "s", s: S.subtitle };
  });

  ws["!ref"] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: metrics.length + 4, c: 3 } });
  ws["!cols"] = [{ wch: 32 }, { wch: 20 }, { wch: 16 }, { wch: 32 }];
  ws["!rows"] = [{ hpt: 40 }, { hpt: 18 }, { hpt: 22 }];
  return ws;
}

// ---------------------------------------------------------------------------
// EXPORT COMPLET — toate graficele într-un singur workbook
// ---------------------------------------------------------------------------

export function exportAllAnalytics(data: ChartsData): void {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, makeSummarySheet(data), "📊 Sumar");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["Data", "Înregistrări", "Confirmați", "Anulați", "Creștere (%)"],
      data.registrationTrend.map(d => [d.date, d.registrations, d.confirmed, d.cancelled, d.growth]),
      "Evoluție Înregistrări Zilnice", [14, 16, 14, 12, 14]),
    "📈 Trend");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["Status", "Număr", "Procent (%)", "Trend"],
      data.statusDistribution.map(d => [d.status, d.count, d.percentage, d.trend === "up" ? "↑" : d.trend === "down" ? "↓" : "→"]),
      "Distribuție Status", [18, 12, 14, 12]),
    "🥧 Status");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["Eveniment", "Locație", "Data Start", "Total", "Confirmați", "Prezenți", "Anulați", "Conversie (%)", "Prezență (%)", "Fill (%)", "Venit (RON)", "Preț", "Monedă"],
      data.eventComparison.map(e => [e.eventTitle, e.location, e.startDate ? new Date(e.startDate).toLocaleDateString("ro-RO") : "—", e.totalParticipants, e.confirmed, e.attended, e.cancelled, e.conversionRate, e.attendanceRate, e.fillRate, e.revenue, e.price, e.currency]),
      "Performanță per Eveniment", [30, 20, 12, 8, 12, 10, 10, 14, 14, 10, 14, 10, 10]),
    "📅 Evenimente");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["Ora", "Înregistrări"],
      data.hourlyPattern.map(d => [d.hour, d.count]),
      "Distribuție Orară", [12, 16]),
    "🕐 Orar");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["Zi", "Înregistrări", "Procent (%)"],
      data.dayOfWeekPattern.map(d => [d.day, d.count, d.percentage]),
      "Activitate Zile Săptămână", [14, 14, 14]),
    "📆 Zile");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["Etapă", "Număr", "Procent (%)", "Drop-off (%)"],
      data.conversionFunnel.map(d => [d.stage, d.count, d.percentage, d.dropOff]),
      "Conversion Funnel", [18, 12, 14, 14]),
    "🔻 Funnel");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["De la", "Spre", "Număr"],
      data.statusTransitions.map(d => [d.from, d.to, d.count]),
      "Tranziții Status", [18, 18, 12]),
    "🔄 Tranziții");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["Cohortă", "Săpt 0", "Săpt 1 (%)", "Săpt 2 (%)", "Săpt 3 (%)", "Săpt 4 (%)"],
      data.cohortData.map(d => [d.cohort, d.week0, d.week1, d.week2, d.week3, d.week4]),
      "Retenție Cohort Săptămânal", [22, 12, 12, 12, 12, 12]),
    "👥 Cohort");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["Nume", "Email", "Prezențe", "Rată Confirmare (%)", "Ultima Activitate"],
      data.topParticipants.map(d => [d.name, d.email, d.eventsAttended, d.confirmedRate, d.lastSeen]),
      "Top Participanți Fideli", [24, 30, 12, 20, 16]),
    "🏆 Top");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["Locație", "Participanți", "Procent (%)"],
      data.geographicData.map(d => [d.location, d.count, d.percentage]),
      "Distribuție Geografică", [30, 16, 14]),
    "📍 Geografic");

  XLSX.utils.book_append_sheet(wb,
    makeSheet(["Tip Participant", "Număr", "Procent (%)"],
      data.tipParticipantData.map(d => [d.tip, d.count, d.percentage]),
      "Distribuție Tip Participant", [24, 12, 14]),
    "👤 Tip");

  if (data.auditActivity.length > 0) {
    XLSX.utils.book_append_sheet(wb,
      makeSheet(["Data", "Login-uri", "Acțiuni", "Erori"],
        data.auditActivity.map(d => [d.date, d.logins, d.actions, d.errors]),
        "Activitate Audit Admin", [14, 12, 12, 10]),
      "🛡️ Audit");
  }

  if (data.notificationStats.length > 0) {
    XLSX.utils.book_append_sheet(wb,
      makeSheet(["Tip Notificare", "Total", "Rată Citire (%)"],
        data.notificationStats.map(d => [d.type, d.count, d.readRate]),
        "Statistici Notificări", [28, 10, 18]),
      "🔔 Notificări");
  }

  const ts = new Date().toISOString().replace(/[:.T]/g, "-").slice(0, 19);
  XLSX.writeFile(wb, `Analytics_Complet_${ts}.xlsx`);
}

// Export individual per grafic — pentru butoanele din UI
export function exportSingleSheet(key: string, data: ChartsData): void {
  const wb = XLSX.utils.book_new();
  const sheets: Record<string, () => [XLSX.WorkSheet, string]> = {
    trend:     () => [makeSheet(["Data","Înregistrări","Confirmați","Anulați","Creștere (%)"], data.registrationTrend.map(d=>[d.date,d.registrations,d.confirmed,d.cancelled,d.growth]), "Trend Înregistrări", [14,16,14,12,14]), "Trend"],
    status:    () => [makeSheet(["Status","Număr","Procent (%)"], data.statusDistribution.map(d=>[d.status,d.count,d.percentage]), "Distribuție Status", [18,12,14]), "Status"],
    events:    () => [makeSheet(["Eveniment","Total","Confirmați","Prezenți","Conversie (%)","Prezență (%)","Venit (RON)"], data.eventComparison.map(e=>[e.eventTitle,e.totalParticipants,e.confirmed,e.attended,e.conversionRate,e.attendanceRate,e.revenue]), "Evenimente", [30,10,12,10,14,14,14]), "Evenimente"],
    hourly:    () => [makeSheet(["Ora","Înregistrări"], data.hourlyPattern.map(d=>[d.hour,d.count]), "Pattern Orar", [12,16]), "Orar"],
    funnel:    () => [makeSheet(["Etapă","Număr","Procent (%)"], data.conversionFunnel.map(d=>[d.stage,d.count,d.percentage]), "Funnel", [18,12,14]), "Funnel"],
    geographic:() => [makeSheet(["Locație","Participanți","Procent (%)"], data.geographicData.map(d=>[d.location,d.count,d.percentage]), "Geografic", [30,16,14]), "Geografic"],
    top:       () => [makeSheet(["Nume","Email","Prezențe","Rată Confirmare (%)"], data.topParticipants.map(d=>[d.name,d.email,d.eventsAttended,d.confirmedRate]), "Top Participanți", [24,30,12,20]), "Top"],
    tip:       () => [makeSheet(["Tip","Număr","Procent (%)"], data.tipParticipantData.map(d=>[d.tip,d.count,d.percentage]), "Tip Participant", [24,12,14]), "Tip"],
  };

  const [ws, sheetName] = sheets[key]?.() ?? sheets["trend"]();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const ts = new Date().toISOString().replace(/[:.T]/g, "-").slice(0, 19);
  XLSX.writeFile(wb, `Analytics_${key}_${ts}.xlsx`);
}