import { describe, expect, it } from "vitest";

import { formatAssignmentValue } from "../lib/format-sql-value";
import { generateUpdate } from "../lib/generate-update";
import { validateUpdateInput } from "../lib/validate-update-input";
import type { SqlUpdateInput } from "../types";

const baseAssignments: SqlUpdateInput["assignments"] = [
  { column: "ultimavez", value: "", dataType: "null" },
  { column: "bloqueado", value: "0", dataType: "number" },
  { column: "intentosLogin", value: "0", dataType: "number" },
  { column: "cambiarclave", value: "0", dataType: "number" },
  { column: "deshabilitado", value: "0", dataType: "number" },
];

const baseInput: SqlUpdateInput = {
  dialect: "sqlserver",
  table: "Usuarios",
  whereColumn: "usuarioid",
  whereDataType: "text",
  whereValues: ["14475488-3"],
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
          { column: "bloqueado", value: "0", dataType: "number" },
          { column: "bloqueado", value: "1", dataType: "number" },
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
UPDATE Usuarios
SET
    ultimavez = NULL,
    bloqueado = 0,
    intentosLogin = 0,
    cambiarclave = 0,
    deshabilitado = 0
WHERE usuarioid IN (
'14475488-3'
);`,
    );
  });

  it("genera un único UPDATE con WHERE IN en modo auto", () => {
    const input: SqlUpdateInput = {
      ...baseInput,
      whereValues: ["14475488-3", "11111111-1", "22222222-2"],
      assignments: [{ column: "deshabilitado", value: "1", dataType: "number" }],
    };

    const { sql, generationType, statementCount } = generateUpdate(input);

    expect(generationType).toBe("bulk");
    expect(statementCount).toBe(1);
    expect(sql).toContain("-- 3 registros · UPDATE masivo (WHERE IN)");
    expect(sql).toContain("WHERE usuarioid IN (");
    expect(sql).toContain("'14475488-3'");
    expect(sql).toContain("'11111111-1'");
    expect(sql).toContain("'22222222-2'");
    expect(sql.match(/UPDATE Usuarios/g)?.length).toBe(1);
  });

  it("genera una sentencia por valor WHERE en modo per-row", () => {
    const input: SqlUpdateInput = {
      ...baseInput,
      generationMode: "per-row",
      whereValues: ["14475488-3", "11111111-1", "22222222-2"],
    };

    const { sql, generationType, statementCount } = generateUpdate(input);

    expect(generationType).toBe("individual");
    expect(statementCount).toBe(3);
    expect(sql).toContain("-- 3 registros · UPDATE individual");
    expect(sql).toContain("WHERE usuarioid = '14475488-3';");
    expect(sql).toContain("WHERE usuarioid = '11111111-1';");
    expect(sql).toContain("WHERE usuarioid = '22222222-2';");
    expect(sql.match(/UPDATE Usuarios/g)?.length).toBe(3);
  });

  it("escapa comillas en cláusula IN", () => {
    const input: SqlUpdateInput = {
      ...baseInput,
      whereValues: ["O'Brien"],
      assignments: [{ column: "deshabilitado", value: "1", dataType: "number" }],
    };

    const { sql } = generateUpdate(input);
    expect(sql).toContain("'O''Brien'");
  });

  it("usa tabla y columnas exactamente como las escribe el usuario", () => {
    const input: SqlUpdateInput = {
      ...baseInput,
      generationMode: "per-row",
      table: "Mi Tabla",
      whereColumn: "[usuarioid]",
      assignments: [{ column: "[estado]", value: "2", dataType: "number" }],
    };

    const { sql } = generateUpdate(input);
    expect(sql).toContain("UPDATE Mi Tabla");
    expect(sql).toContain("    [estado] = 2");
    expect(sql).toContain("WHERE [usuarioid] = '14475488-3';");
  });

  it("produce el mismo SQL para postgresql en MVP", () => {
    const sqlServer = generateUpdate({ ...baseInput, dialect: "sqlserver" });
    const postgres = generateUpdate({ ...baseInput, dialect: "postgresql" });
    expect(postgres.sql).toBe(sqlServer.sql);
  });
});
