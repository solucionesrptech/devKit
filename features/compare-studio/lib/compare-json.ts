import type { CompareOptions, JsonCompareResult } from "../types";

import { diffText } from "./diff-lines";
import { normalizeTextForCompare } from "./normalize";

function collectObjectKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") {
    return prefix ? [prefix] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectObjectKeys(item, prefix ? `${prefix}[${index}]` : `[${index}]`),
    );
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    collectObjectKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

export function formatJson(text: string): {
  formatted: string;
  error?: string;
} {
  try {
    const parsed = JSON.parse(text);
    return {
      formatted: JSON.stringify(parsed, null, 2),
    };
  } catch (error) {
    return {
      formatted: text,
      error: error instanceof Error ? error.message : "JSON inválido",
    };
  }
}

export function compareJson(
  leftText: string,
  rightText: string,
  options: CompareOptions,
): JsonCompareResult {
  const leftParsed = formatJson(leftText);
  const rightParsed = formatJson(rightText);

  const preparedLeft = leftParsed.error
    ? leftText
    : leftParsed.formatted;
  const preparedRight = rightParsed.error
    ? rightText
    : rightParsed.formatted;

  const normalizedLeft = normalizeTextForCompare(preparedLeft, options);
  const normalizedRight = normalizeTextForCompare(preparedRight, options);
  const { lines, summary } = diffText(normalizedLeft, normalizedRight);

  let addedKeys: string[] = [];
  let removedKeys: string[] = [];

  if (!leftParsed.error && !rightParsed.error) {
    const leftKeys = new Set(
      collectObjectKeys(JSON.parse(leftParsed.formatted)),
    );
    const rightKeys = new Set(
      collectObjectKeys(JSON.parse(rightParsed.formatted)),
    );

    addedKeys = [...rightKeys].filter((key) => !leftKeys.has(key));
    removedKeys = [...leftKeys].filter((key) => !rightKeys.has(key));
  }

  return {
    kind: "json",
    lines,
    summary,
    preparedLeft,
    preparedRight,
    isValidLeft: !leftParsed.error,
    isValidRight: !rightParsed.error,
    parseErrorLeft: leftParsed.error,
    parseErrorRight: rightParsed.error,
    addedKeys,
    removedKeys,
  };
}
