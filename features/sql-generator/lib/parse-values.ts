import {
  extractValuesFromCells,
  type ValueExtractionResult,
} from "./extract-values";

export function parseValuesFromText(
  raw: string,
  removeDuplicates = false,
): ValueExtractionResult {
  const lines = raw.split("\n");

  return extractValuesFromCells(lines, {
    removeDuplicates,
    rowsDetected: lines.length,
    rowNumberOffset: 1,
  });
}
