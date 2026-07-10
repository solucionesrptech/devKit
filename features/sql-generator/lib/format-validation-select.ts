import { resolveStatement } from "./dialect";
import { formatInClause } from "./format-in-clause";
import type { SqlUpdateInput } from "../types";

export function formatValidationSelect(
  input: Pick<
    SqlUpdateInput,
    "table" | "whereColumn" | "whereValues" | "whereDataType" | "dialect"
  >,
): string {
  const inClause = formatInClause(input.whereValues, input.whereDataType);

  const baseSql = `SELECT *
FROM ${input.table}
WHERE ${input.whereColumn} IN (
${inClause}
);`;

  return resolveStatement(
    { operation: "SELECT", dialect: input.dialect },
    baseSql,
  );
}
