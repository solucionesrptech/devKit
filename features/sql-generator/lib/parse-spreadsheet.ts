import type { ParsedSpreadsheet } from "../types";

import {
  extractValuesFromCells,
  type ValueExtractionResult,
} from "./extract-values";

function cellToString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export async function parseSpreadsheetFile(
  file: File,
): Promise<ParsedSpreadsheet> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("EMPTY_WORKBOOK");
  }

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(
    sheet,
    { header: 1, defval: "" },
  );

  if (rawRows.length === 0) {
    throw new Error("EMPTY_SHEET");
  }

  const headerRow = rawRows[0] ?? [];
  const columns = headerRow.map((cell, index) => ({
    index,
    name: cellToString(cell) || `Columna ${index + 1}`,
  }));

  const dataRows = rawRows.slice(1).map((row) =>
    columns.map((_, index) => cellToString(row[index])),
  );

  return { columns, rows: dataRows };
}

export function extractColumnValues(
  spreadsheet: ParsedSpreadsheet,
  columnIndex: number,
  removeDuplicates = false,
): ValueExtractionResult {
  const cells = spreadsheet.rows.map((row) => row[columnIndex] ?? "");

  return extractValuesFromCells(cells, {
    removeDuplicates,
    rowsDetected: spreadsheet.rows.length,
    rowNumberOffset: 2,
  });
}
