import type { DuplicateEntry } from "./extract-values";

const CSV_BOM = "\uFEFF";

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return `"${value}"`;
}

function buildDuplicatesCsv(duplicates: DuplicateEntry[]): string {
  const lines = ["valor,cantidad,filas"];

  for (const entry of duplicates) {
    const filas = entry.rowNumbers.join(";");
    lines.push(
      `${escapeCsvField(entry.value)},${entry.count},${escapeCsvField(filas)}`,
    );
  }

  return CSV_BOM + lines.join("\n");
}

function downloadDuplicatesCsv(
  duplicates: DuplicateEntry[],
  filename = "duplicados.csv",
): void {
  const csv = buildDuplicatesCsv(duplicates);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export { buildDuplicatesCsv, downloadDuplicatesCsv };
