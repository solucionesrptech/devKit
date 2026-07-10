import type { CompareOptions, ListCompareResult } from "../types";

import { normalizeLine, splitLines } from "./normalize";

function parseListValues(text: string, options: CompareOptions): string[] {
  const seen = new Set<string>();
  const values: string[] = [];

  for (const line of splitLines(text)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const normalized = normalizeLine(trimmed, options);
    if (seen.has(normalized)) continue;

    seen.add(normalized);
    values.push(trimmed);
  }

  return values;
}

export function compareLists(
  leftText: string,
  rightText: string,
  options: CompareOptions,
): ListCompareResult {
  const leftValues = parseListValues(leftText, options);
  const rightValues = parseListValues(rightText, options);

  const rightSet = new Set(
    rightValues.map((value) => normalizeLine(value, options)),
  );
  const leftSet = new Set(
    leftValues.map((value) => normalizeLine(value, options)),
  );

  const matches: string[] = [];
  const onlyLeft: string[] = [];
  const onlyRight: string[] = [];

  for (const value of leftValues) {
    const key = normalizeLine(value, options);
    if (rightSet.has(key)) {
      matches.push(value);
    } else {
      onlyLeft.push(value);
    }
  }

  for (const value of rightValues) {
    const key = normalizeLine(value, options);
    if (!leftSet.has(key)) {
      onlyRight.push(value);
    }
  }

  const counts = {
    matches: matches.length,
    onlyLeft: onlyLeft.length,
    onlyRight: onlyRight.length,
  };

  return {
    kind: "list",
    matches,
    onlyLeft,
    onlyRight,
    counts,
    summary: {
      isEqual: counts.onlyLeft === 0 && counts.onlyRight === 0,
      totalDifferences: counts.onlyLeft + counts.onlyRight,
      added: counts.onlyRight,
      removed: counts.onlyLeft,
      modified: 0,
      unchanged: counts.matches,
    },
  };
}

export function formatListResultForCopy(result: ListCompareResult): string {
  const sections = [
    `Coinciden (${result.counts.matches})`,
    ...result.matches.map((value) => value),
    "",
    `Solo izquierda (${result.counts.onlyLeft})`,
    ...result.onlyLeft.map((value) => value),
    "",
    `Solo derecha (${result.counts.onlyRight})`,
    ...result.onlyRight.map((value) => value),
  ];

  return sections.join("\n").trim();
}
