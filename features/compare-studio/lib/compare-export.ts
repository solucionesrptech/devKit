import { formatListResultForCopy } from "./compare-lists";
import { formatDiffForCopy } from "./diff-lines";
import type { CompareResult } from "../types";

export function getCompareResultCopyText(
  result: CompareResult | null,
): string | null {
  if (!result) return null;

  if (result.kind === "list") {
    return formatListResultForCopy(result);
  }

  return formatDiffForCopy(result.lines);
}
