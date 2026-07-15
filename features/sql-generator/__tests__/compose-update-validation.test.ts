import { describe, expect, it } from "vitest";

import {
  buildUpdateValidationBlocks,
  composeUpdateValidationScript,
  joinValidationBlocks,
} from "../lib/compose-update-validation";
import { formatValidationSelect } from "../lib/format-validation-select";
import { generateUpdate } from "../lib/generate-update";
import {
  DEFAULT_UPDATE_VALIDATION_OPTIONS,
  type SqlUpdateInput,
} from "../types";

const baseAssignments: SqlUpdateInput["assignments"] = [
  { column: "is_locked", value: "1", dataType: "number" },
];

const baseInput: SqlUpdateInput = {
  dialect: "sqlserver",
  table: "users",
  whereColumn: "id",
  whereDataType: "text",
  whereValues: ["user-001", "user-002"],
  assignments: baseAssignments,
  generationMode: "auto",
};

describe("formatValidationSelect", () => {
  it("genera SELECT con WHERE IN usando los mismos valores", () => {
    const sql = formatValidationSelect(baseInput);

    expect(sql).toBe(`SELECT *
FROM users
WHERE id IN (
'user-001',
'user-002'
);`);
  });
});

describe("buildUpdateValidationBlocks", () => {
  it("defaults: preSelect y update definidos, postSelect null", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const blocks = buildUpdateValidationBlocks(
      baseInput,
      updateSql,
      DEFAULT_UPDATE_VALIDATION_OPTIONS,
    );

    expect(blocks?.preSelect).toContain("VALIDACIÓN PREVIA");
    expect(blocks?.update).toContain("UPDATE");
    expect(blocks?.update).toContain("-- 2 registros · UPDATE masivo (WHERE IN)");
    expect(blocks?.postSelect).toBeNull();
  });

  it("bloque previo no contiene GO ni UPDATE", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const blocks = buildUpdateValidationBlocks(
      baseInput,
      updateSql,
      DEFAULT_UPDATE_VALIDATION_OPTIONS,
    );

    expect(blocks?.preSelect).not.toContain("GO");
    expect(blocks?.preSelect).not.toContain("UPDATE users");
    expect(blocks?.preSelect).toMatch(/SELECT \*\s*\nFROM users/);
  });

  it("bloque update no contiene VALIDACIÓN PREVIA", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const blocks = buildUpdateValidationBlocks(
      baseInput,
      updateSql,
      DEFAULT_UPDATE_VALIDATION_OPTIONS,
    );

    expect(blocks?.update).not.toContain("VALIDACIÓN PREVIA");
    expect(blocks?.update).toContain("UPDATE users");
  });

  it("previo y posterior tienen banners distintos", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const blocks = buildUpdateValidationBlocks(baseInput, updateSql, {
      includePreSelect: true,
      includeUpdate: false,
      includePostSelect: true,
    });

    expect(blocks?.preSelect).toContain("VALIDACIÓN PREVIA");
    expect(blocks?.postSelect).toContain("VALIDACIÓN POSTERIOR");
    expect(blocks?.preSelect).not.toBe(blocks?.postSelect);
  });

  it("solo UPDATE devuelve updateSql sin banner", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const blocks = buildUpdateValidationBlocks(baseInput, updateSql, {
      includePreSelect: false,
      includeUpdate: true,
      includePostSelect: false,
    });

    expect(blocks?.update).toBe(updateSql);
    expect(blocks?.preSelect).toBeNull();
    expect(blocks?.postSelect).toBeNull();
  });

  it("ningún checkbox activo retorna null", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const blocks = buildUpdateValidationBlocks(baseInput, updateSql, {
      includePreSelect: false,
      includeUpdate: false,
      includePostSelect: false,
    });

    expect(blocks).toBeNull();
  });
});

describe("composeUpdateValidationScript", () => {
  it("defaults: SELECT previo + UPDATE con GO en sqlserver", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const blocks = buildUpdateValidationBlocks(
      baseInput,
      updateSql,
      DEFAULT_UPDATE_VALIDATION_OPTIONS,
    );
    const result = composeUpdateValidationScript(
      baseInput,
      updateSql,
      DEFAULT_UPDATE_VALIDATION_OPTIONS,
    );

    expect(result).toBe(joinValidationBlocks(blocks!, baseInput.dialect));
    expect(result).toContain("VALIDACIÓN PREVIA");
    expect(result).toContain("UPDATE");
    expect(result).not.toContain("VALIDACIÓN POSTERIOR");
    expect(result).toContain("\n\nGO\n\n");
    expect(result).toContain("-- 2 registros · UPDATE masivo (WHERE IN)");
    expect(result).toMatch(/SELECT \*\s*\nFROM users[\s\S]*WHERE id IN/);
  });

  it("solo UPDATE devuelve sql sin banners", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const result = composeUpdateValidationScript(baseInput, updateSql, {
      includePreSelect: false,
      includeUpdate: true,
      includePostSelect: false,
    });

    expect(result).toBe(updateSql);
  });

  it("los tres bloques activos generan 2 GO", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const result = composeUpdateValidationScript(baseInput, updateSql, {
      includePreSelect: true,
      includeUpdate: true,
      includePostSelect: true,
    });

    expect(result).toContain("VALIDACIÓN PREVIA");
    expect(result).toContain("VALIDACIÓN POSTERIOR");
    expect(result!.match(/\n\nGO\n\n/g)?.length).toBe(2);
  });

  it("solo SELECT previo sin UPDATE", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const result = composeUpdateValidationScript(baseInput, updateSql, {
      includePreSelect: true,
      includeUpdate: false,
      includePostSelect: false,
    });

    expect(result).toContain("VALIDACIÓN PREVIA");
    expect(result).not.toContain("-- UPDATE");
    expect(result).not.toContain("UPDATE users");
  });

  it("ningún bloque activo retorna null", () => {
    const { sql: updateSql } = generateUpdate(baseInput);
    const result = composeUpdateValidationScript(baseInput, updateSql, {
      includePreSelect: false,
      includeUpdate: false,
      includePostSelect: false,
    });

    expect(result).toBeNull();
  });

  it("postgresql no incluye GO", () => {
    const input: SqlUpdateInput = { ...baseInput, dialect: "postgresql" };
    const { sql: updateSql } = generateUpdate(input);
    const result = composeUpdateValidationScript(
      input,
      updateSql,
      DEFAULT_UPDATE_VALIDATION_OPTIONS,
    );

    expect(result).not.toContain("GO");
  });

  it("UPDATE individual conserva sentencias con SELECT IN de validación", () => {
    const input: SqlUpdateInput = {
      ...baseInput,
      generationMode: "per-row",
    };
    const { sql: updateSql } = generateUpdate(input);
    const result = composeUpdateValidationScript(
      input,
      updateSql,
      DEFAULT_UPDATE_VALIDATION_OPTIONS,
    );

    expect(result).toContain("WHERE id IN (");
    expect(result).toContain("-- 2 registros · UPDATE individual");
    expect(result!.match(/UPDATE users/g)?.length).toBe(2);
  });
});
