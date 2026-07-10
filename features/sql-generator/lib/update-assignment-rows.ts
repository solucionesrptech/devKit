import type {
  UpdateAssignment,
  UpdateAssignmentDataType,
} from "@/features/sql-generator/types";

export type UpdateAssignmentRow = UpdateAssignment & { id: string };

let assignmentRowCounter = 0;

export function createAssignmentRow(
  partial?: Partial<UpdateAssignment>,
): UpdateAssignmentRow {
  assignmentRowCounter += 1;

  return {
    id: `assignment-${assignmentRowCounter}`,
    column: partial?.column ?? "",
    value: partial?.value ?? "",
    dataType: partial?.dataType ?? "number",
  };
}

export function rowsToAssignments(rows: UpdateAssignmentRow[]): UpdateAssignment[] {
  return rows.map(({ column, value, dataType }) => ({
    column,
    value,
    dataType,
  }));
}

export function updateAssignmentRow(
  rows: UpdateAssignmentRow[],
  id: string,
  patch: Partial<UpdateAssignment>,
): UpdateAssignmentRow[] {
  return rows.map((row) => {
    if (row.id !== id) return row;

    const nextDataType = patch.dataType ?? row.dataType;
    const nextValue =
      nextDataType === "null" ? "" : (patch.value ?? row.value);

    return {
      ...row,
      ...patch,
      dataType: nextDataType,
      value: nextValue,
    };
  });
}

export const ASSIGNMENT_DATA_TYPE_LABELS: Record<
  UpdateAssignmentDataType,
  string
> = {
  number: "Número",
  text: "Texto",
  null: "NULL",
};
