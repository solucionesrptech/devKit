import { describe, expect, it } from "vitest";

import { generateSelect } from "../lib/generate-select";
import { generateDelete } from "../lib/generate-delete";
import type { SqlGeneratorInput } from "../types";

const baseInput: SqlGeneratorInput = {
  operation: "SELECT",
  dialect: "sqlserver",
  table: "users",
  whereColumn: "id",
  dataType: "number",
  values: ["101", "102", "103"],
};

describe("generateSelect", () => {
  it("genera SELECT con valores numéricos", () => {
    expect(generateSelect(baseInput)).toBe(
      `SELECT *
FROM users
WHERE id IN (
101,
102,
103
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
      values: ["user-001", "user-002"],
    };

    expect(generateDelete(input)).toBe(
      `DELETE
FROM users
WHERE id IN (
'user-001',
'user-002'
);`,
    );
  });
});
