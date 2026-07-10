import { describe, expect, it } from "vitest";

import { generateSelect } from "../lib/generate-select";
import { generateDelete } from "../lib/generate-delete";
import type { SqlGeneratorInput } from "../types";

const baseInput: SqlGeneratorInput = {
  operation: "SELECT",
  dialect: "sqlserver",
  table: "Contratos",
  whereColumn: "idDocumento",
  dataType: "number",
  values: ["2130933", "2130934", "2130935"],
};

describe("generateSelect", () => {
  it("genera SELECT con valores numéricos", () => {
    expect(generateSelect(baseInput)).toBe(
      `SELECT *
FROM Contratos
WHERE idDocumento IN (
2130933,
2130934,
2130935
);`,
    );
  });

  it("usa tabla y columna exactamente como las escribe el usuario", () => {
    const input: SqlGeneratorInput = {
      ...baseInput,
      table: "Mi Tabla",
      whereColumn: "[id]",
    };
    const sql = generateSelect(input);
    expect(sql).toContain("FROM Mi Tabla");
    expect(sql).toContain("WHERE [id] IN (");
  });

  it("produce el mismo SQL para postgresql en MVP", () => {
    const sqlServer = generateSelect({ ...baseInput, dialect: "sqlserver" });
    const postgres = generateSelect({ ...baseInput, dialect: "postgresql" });
    expect(postgres).toBe(sqlServer);
  });
});

describe("generateDelete", () => {
  it("genera DELETE con valores de texto", () => {
    const input: SqlGeneratorInput = {
      ...baseInput,
      operation: "DELETE",
      dataType: "text",
      values: ["11111111-1", "22222222-2"],
    };

    expect(generateDelete(input)).toBe(
      `DELETE
FROM Contratos
WHERE idDocumento IN (
'11111111-1',
'22222222-2'
);`,
    );
  });
});
