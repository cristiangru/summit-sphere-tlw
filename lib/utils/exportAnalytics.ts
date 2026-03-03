import * as XLSX from "xlsx-js-style";

/**
 * Stiluri predefinite pentru un raport profesional upgradat
 */
const STYLES = {
  header: {
    fill: { fgColor: { rgb: "0F172A" } }, // Slate 900
    font: { color: { rgb: "FFFFFF" }, bold: true, sz: 14 },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "14B8A6" } },
      bottom: { style: "medium", color: { rgb: "14B8A6" } },
      left: { style: "thin", color: { rgb: "14B8A6" } },
      right: { style: "thin", color: { rgb: "14B8A6" } },
    },
  },
  cell: {
    font: { sz: 12 },
    alignment: { horizontal: "left", vertical: "center", wrapText: true },
    border: {
      bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      left: { style: "thin", color: { rgb: "E2E8F0" } },
      right: { style: "thin", color: { rgb: "E2E8F0" } },
    },
  },
  title: {
    font: { bold: true, sz: 16, color: { rgb: "14B8A6" } },
    alignment: { horizontal: "center" },
  },
  subtotal: {
    fill: { fgColor: { rgb: "F0FDFA" } },
    font: { bold: true },
  },
};

export const exportToExcel = (data: any[], fileName: string, sheetName: string) => {
  if (!data || data.length === 0) return;

  const workbook = XLSX.utils.book_new();

  // Adaugă titlu
  const titleRow = [[`${sheetName} Report - Generated on ${new Date().toLocaleDateString()}`]];
  const worksheet = XLSX.utils.aoa_to_sheet(titleRow);

  // Merge title cell
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(data[0]).length - 1 } }];
  worksheet.A1.s = STYLES.title;

  // Adaugă header și data
  XLSX.utils.sheet_add_json(worksheet, data, { origin: "A3" });

  // Calculăm range-ul
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

  // Stilizează Header-ul (Rândul 3)
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const headerAddress = XLSX.utils.encode_col(C) + "3";
    if (worksheet[headerAddress]) {
      worksheet[headerAddress].s = STYLES.header;
    }
  }

  // Stilizează celulele
  for (let R = range.s.r + 3; R <= range.e.r; ++R) { // Start de la row 4
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_col(C) + XLSX.utils.encode_row(R);
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = STYLES.cell;
      }
    }
  }

  // Auto width coloane
  const colWidths = Object.keys(data[0]).map((key, i) => ({
    wch: Math.max(...data.map(row => (row[key]?.toString() || "").length), key.length) + 5
  }));
  worksheet["!cols"] = colWidths;

  // Adaugă subtotaluri dacă e numeric
  const hasNumbers = Object.keys(data[0]).some(key => typeof data[0][key] === "number");
  if (hasNumbers) {
    const subtotalRow = Object.keys(data[0]).reduce((acc, key, idx) => {
      if (typeof data[0][key] === "number") {
        acc[idx] = { t: "n", f: `SUM(${XLSX.utils.encode_col(idx)}4:${XLSX.utils.encode_col(idx)}${range.e.r + 1})` };
      } else {
        acc[idx] = idx === 0 ? "Total" : "";
      }
      return acc;
    }, {} as any);

    XLSX.utils.sheet_add_aoa(worksheet, [Object.values(subtotalRow).map(v => typeof v === "object" ? "" : v)], { origin: -1 });
    Object.entries(subtotalRow).forEach(([col, cell]: any) => {
      if (cell.f) {
        const addr = XLSX.utils.encode_col(parseInt(col)) + (range.e.r + 2).toString();
        worksheet[addr] = cell;
        worksheet[addr].s = { ...STYLES.subtotal, ...STYLES.cell };
      }
    });
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
};

// Functie extra pentru export multi-sheet
export const exportMultiSheet = (sheets: { name: string; data: any[] }[], fileName: string) => {
  const workbook = XLSX.utils.book_new();
  sheets.forEach(({ name, data }) => {
    const ws = XLSX.utils.json_to_sheet(data);
    // Aici poți adăuga stiluri similare
    XLSX.utils.book_append_sheet(workbook, ws, name);
  });
  const timestamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
};