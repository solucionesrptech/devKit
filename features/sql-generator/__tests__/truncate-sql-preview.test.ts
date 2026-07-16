import { describe, expect, it } from "vitest";

import {
  PREVIEW_MAX_IN_LINES,
  PREVIEW_MAX_STATEMENTS,
  truncateSqlPreview,
} from "../lib/truncate-sql-preview";

describe("truncateSqlPreview", () => {
  it("no trunca SQL pequeño con IN", () => {
    const sql = `SELECT *
FROM users
WHERE id IN (
'user-002',
'user-003'
);`;

    const result = truncateSqlPreview(sql);
    expect(result.isTruncated).toBe(false);
    expect(result.previewSql).toBe(sql);
  });

  it("trunca cláusula IN con muchos valores", () => {
    const values = Array.from(
      { length: PREVIEW_MAX_IN_LINES + 10 },
      (_, i) => `'id-${i}'`,
    ).join(",\n");
    const sql = `SELECT *
FROM users
WHERE id IN (
${values}
);`;

    const result = truncateSqlPreview(sql);
    expect(result.isTruncated).toBe(true);
    expect(result.previewStatementCount).toBe(PREVIEW_MAX_IN_LINES);
    expect(result.previewSql).toContain("-- Preview limitado");
    expect(result.previewSql).toContain(
      `-- Se muestran los primeros ${PREVIEW_MAX_IN_LINES} valores.`,
    );
    expect(result.previewSql).toContain("-- Quedan 10 valores adicionales.");
    expect(result.previewSql).toContain(`'id-${PREVIEW_MAX_IN_LINES - 1}'`);
    expect(result.previewSql).not.toContain(`'id-${PREVIEW_MAX_IN_LINES}'`);
  });

  it("cuenta solo los valores del primer IN de un script compuesto", () => {
    const values = Array.from({ length: 50 }, (_, i) => `'rut-${i}'`).join(
      ",\n",
    );
    const sql = `SELECT *
FROM Personas
WHERE personaid IN (
${values}
);

GO

UPDATE Personas
SET Eliminado = 1
WHERE personaid IN (
${values}
);`;

    const result = truncateSqlPreview(sql);

    expect(result.previewSql).toContain("-- Quedan 30 valores adicionales.");
    expect(result.previewSql).not.toContain("-- Quedan 93 valores adicionales.");
  });

  it("trunca múltiples sentencias UPDATE", () => {
    const statements = Array.from(
      { length: PREVIEW_MAX_STATEMENTS + 5 },
      (_, i) =>
        `UPDATE users\nSET is_locked = 1\nWHERE id = 'id-${i}';`,
    );
    const sql = `-- 55 registros · UPDATE individual\n${statements.join("\n\n")}`;

    const result = truncateSqlPreview(sql);
    expect(result.isTruncated).toBe(true);
    expect(result.previewStatementCount).toBe(PREVIEW_MAX_STATEMENTS);
    expect(result.previewSql).toContain("-- Preview limitado");
    expect(result.previewSql).toContain(
      `-- Se muestran los primeros ${PREVIEW_MAX_STATEMENTS} sentencias.`,
    );
    expect(result.previewSql).toContain("-- Quedan 5 sentencias adicionales.");
    expect(result.previewSql).not.toContain("id-54");
  });

  it("no trunca UPDATE bulk con pocos valores en IN", () => {
    const sql = `-- 2 registros · UPDATE masivo (WHERE IN)
UPDATE users
SET is_locked = 1
WHERE id IN (
'user-002',
'user-003'
);`;

    const result = truncateSqlPreview(sql);
    expect(result.isTruncated).toBe(false);
  });
});
