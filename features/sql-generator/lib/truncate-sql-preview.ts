export const PREVIEW_MAX_STATEMENTS = 20;
export const PREVIEW_MAX_IN_LINES = 20;

export type TruncatePreviewResult = {
  previewSql: string;
  isTruncated: boolean;
  previewStatementCount: number;
};

function buildTruncationFooter(
  shown: number,
  remaining: number,
  unit: "valores" | "sentencias",
): string {
  const additional =
    unit === "valores" ? "valores adicionales" : "sentencias adicionales";

  return `
----------------------------------------

-- Preview limitado
-- Se muestran los primeros ${shown} ${unit}.
-- Quedan ${remaining} ${additional}.
-- Usa los botones de copia para obtener cada bloque completo.

----------------------------------------`;
}

function truncateInClause(
  sql: string,
  maxLines: number,
): TruncatePreviewResult {
  const inMarker = "IN (\n";
  const inStart = sql.indexOf(inMarker);
  if (inStart === -1) {
    return { previewSql: sql, isTruncated: false, previewStatementCount: 1 };
  }

  const before = sql.slice(0, inStart + inMarker.length);
  const afterIn = sql.slice(inStart + inMarker.length);
  const closingIdx = afterIn.indexOf("\n);");

  if (closingIdx === -1) {
    return { previewSql: sql, isTruncated: false, previewStatementCount: 1 };
  }

  const inBody = afterIn.slice(0, closingIdx);
  const after = afterIn.slice(closingIdx);
  const lines = inBody.split("\n");

  if (lines.length <= maxLines) {
    return {
      previewSql: sql,
      isTruncated: false,
      previewStatementCount: lines.length,
    };
  }

  const remaining = lines.length - maxLines;
  const footer = buildTruncationFooter(maxLines, remaining, "valores");
  const previewSql = `${before}${lines.slice(0, maxLines).join("\n")}${footer}${after}`;

  return {
    previewSql,
    isTruncated: true,
    previewStatementCount: maxLines,
  };
}

function truncateByStatements(
  sql: string,
  maxStatements: number,
): TruncatePreviewResult {
  const headerMatch = sql.match(/^(?:--[^\n]*\n)+/);
  const header = headerMatch?.[0] ?? "";
  const body = sql.slice(header.length).trim();

  const statements = body.split(/\n\n(?=UPDATE )/);

  if (statements.length <= maxStatements) {
    return {
      previewSql: sql,
      isTruncated: false,
      previewStatementCount: statements.length,
    };
  }

  const remaining = statements.length - maxStatements;
  const footer = buildTruncationFooter(maxStatements, remaining, "sentencias");
  const previewSql = `${header}${statements.slice(0, maxStatements).join("\n\n")}${footer}`;

  return {
    previewSql,
    isTruncated: true,
    previewStatementCount: maxStatements,
  };
}

export function truncateSqlPreview(sql: string): TruncatePreviewResult {
  const updateCount = (sql.match(/^UPDATE /gm) || []).length;

  if (updateCount > 1) {
    return truncateByStatements(sql, PREVIEW_MAX_STATEMENTS);
  }

  if (sql.includes("IN (\n")) {
    return truncateInClause(sql, PREVIEW_MAX_IN_LINES);
  }

  return { previewSql: sql, isTruncated: false, previewStatementCount: 1 };
}
