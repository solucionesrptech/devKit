import { describe, expect, it } from "vitest";

import { generateSql } from "../lib/generate-sql";

describe("generateSql", () => {
  it("pide tabla si falta", () => {
    const result = generateSql({
      operation: "SELECT",
      dialect: "sqlserver",
      table: "",
      whereColumn: "id",
      dataType: "number",
      values: ["1"],
    });
    expect(result.sql).toBeNull();
    expect(result.message).toBe("Indica el nombre de la tabla.");
  });

  it("pide columna si falta", () => {
    const result = generateSql({
      operation: "SELECT",
      dialect: "sqlserver",
      table: "Contratos",
      whereColumn: "",
      dataType: "number",
      values: ["1"],
    });
    expect(result.sql).toBeNull();
    expect(result.message).toBe("Indica la columna del WHERE.");
  });

  it("pide datos si la lista está vacía", () => {
    const result = generateSql({
      operation: "SELECT",
      dialect: "sqlserver",
      table: "Contratos",
      whereColumn: "id",
      dataType: "number",
      values: [],
    });
    expect(result.sql).toBeNull();
    expect(result.message).toBe("Pega una lista o sube un archivo con datos.");
  });

  it("valida números no numéricos", () => {
    const result = generateSql({
      operation: "SELECT",
      dialect: "sqlserver",
      table: "Contratos",
      whereColumn: "id",
      dataType: "number",
      values: ["123", "abc"],
    });
    expect(result.sql).toBeNull();
    expect(result.message).toBe(
      "Hay valores que no son numéricos. Revisa la lista.",
    );
  });

  it("incluye metadata de generación", () => {
    const result = generateSql({
      operation: "SELECT",
      dialect: "sqlserver",
      table: "Contratos",
      whereColumn: "id",
      dataType: "text",
      values: ["11111111-1", "22222222-2"],
    });

    expect(result.sql).not.toBeNull();
    expect(result.generationMeta?.recordCount).toBe(2);
    expect(result.generationMeta?.generationLabel).toBe("SELECT");
    expect(result.generationMeta?.statementCount).toBe(1);
    expect(result.generationMeta?.durationMs).toBeGreaterThanOrEqual(0);
  });

  it("trunca preview para listas grandes", () => {
    const values = Array.from({ length: 60 }, (_, i) => `id-${i}`);
    const result = generateSql({
      operation: "SELECT",
      dialect: "sqlserver",
      table: "Contratos",
      whereColumn: "id",
      dataType: "text",
      values,
    });

    expect(result.sql).not.toBeNull();
    expect(result.previewSql).toBeDefined();
    expect(result.generationMeta?.isPreviewTruncated).toBe(true);
    expect(result.generationMeta?.recordCount).toBe(60);
  });
});
