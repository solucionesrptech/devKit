import { buildGenerationResult } from "./build-generation-result";
import { generateDelete } from "./generate-delete";
import { generateSelect } from "./generate-select";
import { validateValuesForDataType } from "./validate-values";
import type { SqlGeneratorInput, SqlGeneratorResult } from "../types";

const generators = {
  SELECT: generateSelect,
  DELETE: generateDelete,
} as const;

export function generateSql(input: SqlGeneratorInput): SqlGeneratorResult {
  if (!input.table.trim()) {
    return { sql: null, message: "Indica el nombre de la tabla." };
  }

  if (!input.whereColumn.trim()) {
    return { sql: null, message: "Indica la columna del WHERE." };
  }

  if (input.values.length === 0) {
    return { sql: null, message: "Pega una lista o sube un archivo con datos." };
  }

  const validationMessage = validateValuesForDataType(
    input.values,
    input.dataType,
  );
  if (validationMessage) {
    return { sql: null, message: validationMessage };
  }

  const normalized: SqlGeneratorInput = {
    ...input,
    table: input.table,
    whereColumn: input.whereColumn,
  };

  const startTime = performance.now();
  const sql = generators[input.operation](normalized);

  return buildGenerationResult(
    sql,
    {
      recordCount: input.values.length,
      statementCount: 1,
      generationLabel: input.operation,
    },
    startTime,
  );
}
