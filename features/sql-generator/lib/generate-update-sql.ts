import { buildGenerationResult } from "./build-generation-result";
import {
  buildUpdateValidationBlocks,
  composeUpdateValidationScript,
} from "./compose-update-validation";
import { generateUpdate } from "./generate-update";
import { validateUpdateInput } from "./validate-update-input";
import {
  DEFAULT_UPDATE_VALIDATION_OPTIONS,
  type SqlGeneratorResult,
  type SqlUpdateInput,
} from "../types";

function getUpdateGenerationLabel(
  generationType: "bulk" | "individual",
): string {
  return generationType === "bulk"
    ? "UPDATE masivo (WHERE IN)"
    : "UPDATE individual";
}

export function generateUpdateSql(input: SqlUpdateInput): SqlGeneratorResult {
  if (!input.table.trim()) {
    return { sql: null, message: "Indica el nombre de la tabla." };
  }

  if (!input.whereColumn.trim()) {
    return { sql: null, message: "Indica la columna del WHERE." };
  }

  const validationMessage = validateUpdateInput(input);
  if (validationMessage) {
    return { sql: null, message: validationMessage };
  }

  const options = input.validationOptions ?? DEFAULT_UPDATE_VALIDATION_OPTIONS;

  if (
    !options.includePreSelect &&
    !options.includeUpdate &&
    !options.includePostSelect
  ) {
    return {
      sql: null,
      message: "Selecciona al menos un bloque de validación.",
    };
  }

  const startTime = performance.now();
  const { sql: updateSql, generationType, statementCount } = generateUpdate(input);
  const generationLabel = getUpdateGenerationLabel(generationType);
  const validationBlocks = buildUpdateValidationBlocks(input, updateSql, options);
  const fullSql = composeUpdateValidationScript(input, updateSql, options);

  if (!fullSql) {
    return {
      sql: null,
      message: "Selecciona al menos un bloque de validación.",
    };
  }

  const result = buildGenerationResult(
    fullSql,
    {
      recordCount: input.whereValues.length,
      statementCount,
      generationLabel,
    },
    startTime,
  );

  return {
    ...result,
    validationBlocks,
    updateMeta: {
      recordCount: input.whereValues.length,
      generationType,
      statementCount,
    },
  };
}
