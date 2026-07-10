import { formatInClause } from "./format-in-clause";
import { formatAssignmentValue, formatSqlValue } from "./format-sql-value";
import { resolveStatement } from "./dialect";
import type {
  SqlUpdateInput,
  UpdateGenerationType,
} from "../types";

export type GenerateUpdateResult = {
  sql: string;
  generationType: UpdateGenerationType;
  statementCount: number;
};

function formatSetClause(
  assignments: SqlUpdateInput["assignments"],
): string {
  const lines = assignments.map(
    (assignment) =>
      `    ${assignment.column} = ${formatAssignmentValue(assignment)}`,
  );

  return `SET\n${lines.join(",\n")}`;
}

function formatUpdateStatement(
  input: SqlUpdateInput,
  whereValue: string,
): string {
  const formattedWhere = formatSqlValue(whereValue, input.whereDataType);
  const setClause = formatSetClause(input.assignments);

  return `UPDATE ${input.table}
${setClause}
WHERE ${input.whereColumn} = ${formattedWhere};`;
}

function formatBulkUpdateStatement(input: SqlUpdateInput): string {
  const inClause = formatInClause(input.whereValues, input.whereDataType);
  const setClause = formatSetClause(input.assignments);

  return `UPDATE ${input.table}
${setClause}
WHERE ${input.whereColumn} IN (
${inClause}
);`;
}

function buildUpdateHeader(
  recordCount: number,
  generationType: UpdateGenerationType,
): string {
  const tipo =
    generationType === "bulk"
      ? "UPDATE masivo (WHERE IN)"
      : "UPDATE individual";

  return `-- ${recordCount} registros · ${tipo}`;
}

function isHomogeneousSet(_input: SqlUpdateInput): boolean {
  // Hoy el SET es global para todos los registros. Preparado para SET por fila futuro.
  return true;
}

function shouldUseBulkUpdate(input: SqlUpdateInput): boolean {
  if (input.generationMode === "per-row") return false;
  return isHomogeneousSet(input);
}

export function generateUpdate(input: SqlUpdateInput): GenerateUpdateResult {
  const recordCount = input.whereValues.length;
  const useBulk = shouldUseBulkUpdate(input);

  if (useBulk) {
    const body = formatBulkUpdateStatement(input);
    const header = buildUpdateHeader(recordCount, "bulk");
    const sql = resolveStatement(
      { operation: "UPDATE", dialect: input.dialect },
      `${header}\n${body}`,
    );

    return { sql, generationType: "bulk", statementCount: 1 };
  }

  const statements = input.whereValues.map((whereValue) =>
    formatUpdateStatement(input, whereValue),
  );
  const header = buildUpdateHeader(recordCount, "individual");
  const sql = resolveStatement(
    { operation: "UPDATE", dialect: input.dialect },
    `${header}\n${statements.join("\n\n")}`,
  );

  return {
    sql,
    generationType: "individual",
    statementCount: recordCount,
  };
}
