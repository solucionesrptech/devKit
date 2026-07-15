import { describe, expect, it } from "vitest";

import { formatAssignmentValue } from "../lib/format-sql-value";
import { generateUpdate } from "../lib/generate-update";
import { validateUpdateInput } from "../lib/validate-update-input";
import type { SqlUpdateInput } from "../types";

const baseAssignments: SqlUpdateInput["assignments"] = [
  { column: "last_login", value: "", dataType: "null" },
  { column: "is_locked", value: "0", dataType: "number" },
  { column: "intentosLogin", value: "0", dataType: "number" },
  { column: "cambiarclave", value: "0", dataType: "number" },
  { column: "is_locked", value: "0", dataType: "number" },
];

const baseInput: SqlUpdateInput = {
  dialect: "sqlserver",
  table: "users",
  whereColumn: "id",
  whereDataType: "text",
  whereValues: ["user-001"],
  assignments: baseAssignments,
  generationMode: "auto",
};

describe("formatAssignmentValue", () => {
  it("formatea NULL", () => {
    expect(
      formatAssignmentValue({ value: "", dataType: "null" }),
    ).toBe("NULL");
  });

  it("formatea texto", () => {
    expect(
      formatAssignmentValue({ value: "activo", dataType: "text" }),
    ).toBe("'activo'");
  });
});

describe("validateUpdateInput", () => {
  it("rechaza sin assignments", () => {
    expect(
      validateUpdateInput({
        assignments: [],
        whereValues: ["1"],
        whereDataType: "number",
      }),
    ).toBe("Agrega al menos una columna SET.");
  });

  it("rechaza columnas duplicadas", () => {
    expect(
      validateUpdateInput({
        assignments: [
          { column: "is_locked", value: "0", dataType: "number" },
          { column: "is_locked", value: "1", dataType: "number" },
        ],
        whereValues: ["1"],
        whereDataType: "number",
      }),
    ).toBe("Hay columnas SET duplicadas. Revisa la tabla.");
  });
});

describe("generateUpdate", () => {
  it("genera UPDATE masivo con un registro en modo auto", () => {
    const { sql, generationType, statementCount } = generateUpdate(baseInput);

    expect(generationType).toBe("bulk");
    expect(statementCount).toBe(1);
    expect(sql).toBe(
      `-- 1 registros · UPDATE masivo (WHERE IN)
UPDATE users
SET
    last_login = NULL,
    is_locked = 0,
    intentosLogin = 0,
    cambiarclave = 0,
    is_locked = 0
WHERE id IN (
'user-001'
);`,
    );
  });

  it("genera un único UPDATE con WHERE IN en modo auto", () => {
    const input: SqlUpdateInput = {
      ...baseInput,
      whereValues: ["user-001", "user-002", "user-003"],
      assignments: [{ column: "is_locked", value: "1", dataType: "number" }],
    };

    const { sql, generationType, statementCount } = generateUpdate(input);

    expect(generationType).toBe("bulk");
    expect(statementCount).toBe(1);
    expect(sql).toContain("-- 3 registros · UPDATE masivo (WHERE IN)");
    expect(sql).toContain("WHERE id IN (");
    expect(sql).toContain("'user-001'");
    expect(sql).toContain("'user-002'");
    expect(sql).toContain("'user-003'");
    expect(sql.match(/UPDATE users/g)?.length).toBe(1);
  });

  it("genera una sentencia por valor WHERE en modo per-row", () => {
    const input: SqlUpdateInput = {
      ...baseInput,
      generationMode: "per-row",
      whereValues: ["user-001", "user-002", "user-003"],
    };

    const { sql, generationType, statementCount } = generateUpdate(input);

    expect(generationType).toBe("individual");
    expect(statementCount).toBe(3);
    expect(sql).toContain("-- 3 registros · UPDATE individual");
    expect(sql).toContain("WHERE id = 'user-001';");
    expect(sql).toContain("WHERE id = 'user-002';");
    expect(sql).toContain("WHERE id = 'user-003';");
    expect(sql.match(/UPDATE users/g)?.length).toBe(3);
  });

  it("escapa comillas en cláusula IN", () => {
    const input: SqlUpdateInput = {
      ...baseInput,
      whereValues: ["O'Brien"],
      assignments: [{ column: "is_locked", value: "1", dataType: "number" }],
    };

    const { sql } = generateUpdate(input);
    expect(sql).toContain("'O''Brien'");
  });

  it("usa tabla y columnas exactamente como las escribe el usuario", () => {
    const input: SqlUpdateInput = {
      ...baseInput,
      generationMode: "per-row",
      table: "Mi Tabla",
      whereColumn: "[id]",
      assignments: [{ column: "[estado]", value: "2", dataType: "number" }],
    };

    const { sql } = generateUpdate(input);
    expect(sql).toContain("UPDATE Mi Tabla");
    expect(sql).toContain("    [estado] = 2");
    expect(sql).toContain("WHERE [id] = 'user-001';");
  });

  it("produce el mismo SQL para postgresql en MVP", () => {
    const sqlServer = generateUpdate({ ...baseInput, dialect: "sqlserver" });
    const postgres = generateUpdate({ ...baseInput, dialect: "postgresql" });
    expect(postgres.sql).toBe(sqlServer.sql);
  });
});
