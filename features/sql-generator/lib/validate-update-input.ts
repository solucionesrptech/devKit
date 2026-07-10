import type { SqlUpdateInput, UpdateAssignment, ValueDataType } from "../types";

import { validateNumericValues } from "./validate-values";

function validateColumnValues(
  values: string[],
  dataType: ValueDataType,
  columnLabel: string,
): string | null {
  if (dataType !== "number") return null;

  const invalid = validateNumericValues(values);
  if (invalid.length === 0) return null;

  return `Hay valores no numéricos en ${columnLabel}. Revisa la lista.`;
}

function validateAssignment(
  assignment: UpdateAssignment,
): string | null {
  if (!assignment.column.trim()) {
    return "Indica el nombre de cada columna SET.";
  }

  if (assignment.dataType === "null") {
    return null;
  }

  if (!assignment.value.trim()) {
    return `Indica el valor para la columna ${assignment.column}.`;
  }

  if (assignment.dataType === "number") {
    const invalid = validateNumericValues([assignment.value]);
    if (invalid.length > 0) {
      return `El valor de ${assignment.column} no es numérico.`;
    }
  }

  return null;
}

export function validateUpdateInput(
  input: Pick<
    SqlUpdateInput,
    "assignments" | "whereValues" | "whereDataType"
  >,
): string | null {
  if (input.assignments.length === 0) {
    return "Agrega al menos una columna SET.";
  }

  const columns = input.assignments.map((a) => a.column.trim().toLowerCase());
  const duplicates = columns.filter(
    (col, index) => col && columns.indexOf(col) !== index,
  );
  if (duplicates.length > 0) {
    return "Hay columnas SET duplicadas. Revisa la tabla.";
  }

  for (const assignment of input.assignments) {
    const message = validateAssignment(assignment);
    if (message) return message;
  }

  if (input.whereValues.length === 0) {
    return "Pega valores WHERE o sube un archivo con datos.";
  }

  const emptyWhere = input.whereValues.some((value) => !value.trim());
  if (emptyWhere) {
    return "Hay valores WHERE vacíos.";
  }

  const whereMessage = validateColumnValues(
    input.whereValues,
    input.whereDataType,
    "columna WHERE",
  );
  if (whereMessage) return whereMessage;

  return null;
}
