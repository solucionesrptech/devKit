import { describe, expect, it } from "vitest";

import { extractValuesFromCells } from "../lib/extract-values";
import { extractColumnValues } from "../lib/parse-spreadsheet";
import { parseValuesFromText } from "../lib/parse-values";
import type { ParsedSpreadsheet } from "../types";

function buildSpreadsheet(values: string[]): ParsedSpreadsheet {
  return {
    columns: [{ index: 0, name: "id" }],
    rows: values.map((value) => [value]),
  };
}

describe("extractValuesFromCells", () => {
  it("conserva duplicados por defecto", () => {
    const result = extractValuesFromCells(["a", "b", "a", "c"], {
      removeDuplicates: false,
      rowsDetected: 4,
      rowNumberOffset: 1,
    });

    expect(result.values).toEqual(["a", "b", "a", "c"]);
    expect(result.stats.validProcessed).toBe(4);
    expect(result.stats.omittedDuplicates).toBe(0);
    expect(result.quality.duplicateRecords).toBe(1);
    expect(result.error).toBeNull();
  });

  it("reporta duplicados con números de fila en texto", () => {
    const result = extractValuesFromCells(["a", "b", "a", "c"], {
      removeDuplicates: false,
      rowsDetected: 4,
      rowNumberOffset: 1,
    });

    expect(result.duplicates).toEqual([
      { value: "a", count: 2, rowNumbers: [1, 3] },
    ]);
    expect(result.quality.uniqueValues).toBe(3);
    expect(result.quality.duplicateRecords).toBe(1);
  });

  it("quita duplicados solo cuando la opción está activa", () => {
    const result = extractValuesFromCells(["a", "b", "a", "c", "b"], {
      removeDuplicates: true,
      rowsDetected: 5,
      rowNumberOffset: 1,
    });

    expect(result.values).toEqual(["a", "b", "c"]);
    expect(result.stats.validProcessed).toBe(3);
    expect(result.stats.omittedDuplicates).toBe(2);
    expect(result.quality.validRecords).toBe(5);
    expect(result.quality.duplicateRecords).toBe(2);
    expect(result.duplicates).toHaveLength(2);
  });

  it("omite filas vacías y continúa leyendo", () => {
    const result = extractValuesFromCells(["a", "", "  ", "b", ""], {
      removeDuplicates: false,
      rowsDetected: 5,
      rowNumberOffset: 1,
    });

    expect(result.values).toEqual(["a", "b"]);
    expect(result.quality.emptyRows).toBe(3);
    expect(result.stats.omittedEmpty).toBe(3);
    expect(result.stats.validProcessed).toBe(2);
  });

  it("procesa más de 10000 registros válidos sin límite artificial", () => {
    const cells = Array.from({ length: 25_000 }, (_, i) => String(i));
    const result = extractValuesFromCells(cells, {
      removeDuplicates: false,
      rowsDetected: cells.length,
      rowNumberOffset: 1,
    });

    expect(result.values).toHaveLength(25_000);
    expect(result.values.at(-1)).toBe("24999");
    expect(result.error).toBeNull();
    expect(result.stats.validProcessed).toBe(25_000);
    expect(result.quality.validRecords).toBe(25_000);
    expect(result.duplicates).toEqual([]);
  });

  it("no tiene duplicados cuando todos los valores son únicos", () => {
    const result = extractValuesFromCells(["a", "b", "c"], {
      removeDuplicates: false,
      rowsDetected: 3,
      rowNumberOffset: 1,
    });

    expect(result.duplicates).toEqual([]);
    expect(result.quality.duplicateRecords).toBe(0);
  });
});

describe("extractColumnValues", () => {
  it("procesa 7721 filas válidas con duplicados", () => {
    const spreadsheet = buildSpreadsheet(
      Array.from({ length: 7721 }, (_, i) => `rut-${i}`),
    );

    const result = extractColumnValues(spreadsheet, 0, false);

    expect(result.values).toHaveLength(7721);
    expect(result.quality.rowsDetected).toBe(7721);
    expect(result.quality.validRecords).toBe(7721);
    expect(result.quality.uniqueValues).toBe(7721);
    expect(result.error).toBeNull();
  });

  it("usa offset de fila 2 para Excel", () => {
    const spreadsheet = buildSpreadsheet(["a", "b", "a"]);

    const result = extractColumnValues(spreadsheet, 0, false);

    expect(result.duplicates).toEqual([
      { value: "a", count: 2, rowNumbers: [2, 4] },
    ]);
  });

  it("genera solo valores únicos con quitar duplicados", () => {
    const spreadsheet = buildSpreadsheet([
      "a",
      "b",
      "a",
      "c",
      "b",
      "",
    ]);

    const result = extractColumnValues(spreadsheet, 0, true);

    expect(result.values).toEqual(["a", "b", "c"]);
    expect(result.stats.validProcessed).toBe(3);
    expect(result.quality.validRecords).toBe(5);
    expect(result.quality.emptyRows).toBe(1);
    expect(result.stats.omittedDuplicates).toBe(2);
  });
});

describe("parseValuesFromText", () => {
  it("conserva duplicados en texto con filas 1-based", () => {
    const result = parseValuesFromText("a\nb\na\nc", false);
    expect(result.values).toEqual(["a", "b", "a", "c"]);
    expect(result.duplicates[0]?.rowNumbers).toEqual([1, 3]);
  });

  it("elimina duplicados en texto cuando la opción está activa", () => {
    const result = parseValuesFromText("a\nb\na\nc\nb", true);
    expect(result.values).toEqual(["a", "b", "c"]);
    expect(result.stats.omittedDuplicates).toBe(2);
    expect(result.quality.validRecords).toBe(5);
  });
});
