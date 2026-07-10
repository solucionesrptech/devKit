import type { SqlGenerationMeta, SqlGeneratorResult } from "../types";

import { truncateSqlPreview } from "./truncate-sql-preview";

export function buildGenerationResult(
  fullSql: string,
  meta: Omit<
    SqlGenerationMeta,
    "durationMs" | "isPreviewTruncated" | "previewStatementCount"
  >,
  startTime: number,
): SqlGeneratorResult {
  const { previewSql, isTruncated, previewStatementCount } =
    truncateSqlPreview(fullSql);
  const durationMs = Math.round(performance.now() - startTime);

  return {
    sql: fullSql,
    previewSql: isTruncated ? previewSql : undefined,
    generationMeta: {
      ...meta,
      durationMs,
      isPreviewTruncated: isTruncated,
      previewStatementCount,
    },
  };
}
