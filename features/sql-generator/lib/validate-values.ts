import type { ValueDataType } from "../types";

const NUMERIC_PATTERN = /^-?\d+(\.\d+)?$/;

export function validateNumericValues(values: string[]): string[] {
  return values.filter((value) => !NUMERIC_PATTERN.test(value));
}

export function validateValuesForDataType(
  values: string[],
  dataType: ValueDataType,
): string | null {
  if (dataType !== "number") return null;

  const invalid = validateNumericValues(values);
  if (invalid.length === 0) return null;

  return "Hay valores que no son numéricos. Revisa la lista.";
}
