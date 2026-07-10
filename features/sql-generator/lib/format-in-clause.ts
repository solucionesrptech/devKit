import type { ValueDataType } from "../types";

import { formatSqlValue } from "./format-sql-value";

export function formatInClause(values: string[], dataType: ValueDataType): string {
  const formatted = values.map((value) => formatSqlValue(value, dataType));

  return formatted.join(",\n");
}
