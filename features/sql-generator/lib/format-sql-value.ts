import type { UpdateAssignment, ValueDataType } from "../types";

export function formatSqlValue(
  value: string,
  dataType: ValueDataType,
): string {
  if (dataType === "number") {
    return value;
  }

  const escaped = value.replace(/'/g, "''");
  return `'${escaped}'`;
}

export function formatAssignmentValue(
  assignment: Pick<UpdateAssignment, "value" | "dataType">,
): string {
  if (assignment.dataType === "null") {
    return "NULL";
  }

  return formatSqlValue(assignment.value, assignment.dataType);
}
