import { formatInClause } from "./format-in-clause";
import { resolveStatement } from "./dialect";
import type { SqlGeneratorInput } from "../types";

export function generateSelect(input: SqlGeneratorInput): string {
  const inClause = formatInClause(input.values, input.dataType);

  const baseSql = `SELECT *
FROM ${input.table}
WHERE ${input.whereColumn} IN (
${inClause}
);`;

  return resolveStatement(input, baseSql);
}
