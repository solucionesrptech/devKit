import { describe, expect, it } from "vitest";

import { buildDuplicatesCsv } from "../lib/export-duplicates-csv";

describe("buildDuplicatesCsv", () => {
  it("genera cabecera y filas con BOM", () => {
    const csv = buildDuplicatesCsv([
      { value: "12345", count: 3, rowNumbers: [2, 15, 88] },
    ]);

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("valor,cantidad,filas");
    expect(csv).toContain('"12345",3,"2;15;88"');
  });

  it("escapa comillas en valores", () => {
    const csv = buildDuplicatesCsv([
      { value: 'a"b', count: 2, rowNumbers: [1, 4] },
    ]);

    expect(csv).toContain('"a""b"');
  });

  it("devuelve solo cabecera cuando no hay duplicados", () => {
    const csv = buildDuplicatesCsv([]);
    expect(csv).toBe("\uFEFFvalor,cantidad,filas");
  });
});
