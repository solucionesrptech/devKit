import type { CompareSummary, DiffLine, DiffLineType } from "../types";

import { splitLines } from "./normalize";

function buildSummary(lines: DiffLine[]): CompareSummary {
  let added = 0;
  let removed = 0;
  let modified = 0;
  let unchanged = 0;

  for (const line of lines) {
    switch (line.type) {
      case "add":
        added += 1;
        break;
      case "remove":
        removed += 1;
        break;
      case "modify":
        modified += 1;
        break;
      case "equal":
        unchanged += 1;
        break;
    }
  }

  const totalDifferences = added + removed + modified;

  return {
    isEqual: totalDifferences === 0,
    totalDifferences,
    added,
    removed,
    modified,
    unchanged,
  };
}

function pushDiff(
  result: DiffLine[],
  type: DiffLineType,
  leftLineNumber: number | undefined,
  rightLineNumber: number | undefined,
  leftContent: string | undefined,
  rightContent: string | undefined,
) {
  const last = result[result.length - 1];

  if (
    type === "add" &&
    last?.type === "remove" &&
    last.leftContent !== undefined
  ) {
    result[result.length - 1] = {
      type: "modify",
      leftLineNumber: last.leftLineNumber,
      rightLineNumber,
      leftContent: last.leftContent,
      rightContent,
    };
    return;
  }

  result.push({
    type,
    leftLineNumber,
    rightLineNumber,
    leftContent,
    rightContent,
  });
}

export function diffLines(leftText: string, rightText: string): DiffLine[] {
  const leftLines = splitLines(leftText);
  const rightLines = splitLines(rightText);
  const leftLength = leftLines.length;
  const rightLength = rightLines.length;

  const lcs: number[][] = Array.from({ length: leftLength + 1 }, () =>
    Array(rightLength + 1).fill(0),
  );

  for (let leftIndex = 1; leftIndex <= leftLength; leftIndex += 1) {
    for (let rightIndex = 1; rightIndex <= rightLength; rightIndex += 1) {
      if (leftLines[leftIndex - 1] === rightLines[rightIndex - 1]) {
        lcs[leftIndex][rightIndex] = lcs[leftIndex - 1][rightIndex - 1] + 1;
      } else {
        lcs[leftIndex][rightIndex] = Math.max(
          lcs[leftIndex - 1][rightIndex],
          lcs[leftIndex][rightIndex - 1],
        );
      }
    }
  }

  const result: DiffLine[] = [];
  let leftIndex = leftLength;
  let rightIndex = rightLength;

  while (leftIndex > 0 || rightIndex > 0) {
    if (
      leftIndex > 0 &&
      rightIndex > 0 &&
      leftLines[leftIndex - 1] === rightLines[rightIndex - 1]
    ) {
      pushDiff(
        result,
        "equal",
        leftIndex,
        rightIndex,
        leftLines[leftIndex - 1],
        rightLines[rightIndex - 1],
      );
      leftIndex -= 1;
      rightIndex -= 1;
    } else if (
      rightIndex > 0 &&
      (leftIndex === 0 ||
        lcs[leftIndex][rightIndex - 1] >= lcs[leftIndex - 1][rightIndex])
    ) {
      pushDiff(
        result,
        "add",
        undefined,
        rightIndex,
        undefined,
        rightLines[rightIndex - 1],
      );
      rightIndex -= 1;
    } else if (leftIndex > 0) {
      pushDiff(
        result,
        "remove",
        leftIndex,
        undefined,
        leftLines[leftIndex - 1],
        undefined,
      );
      leftIndex -= 1;
    }
  }

  result.reverse();
  return result;
}

export function diffText(leftText: string, rightText: string): {
  lines: DiffLine[];
  summary: CompareSummary;
} {
  const lines = diffLines(leftText, rightText);
  return {
    lines,
    summary: buildSummary(lines),
  };
}

export function formatDiffForCopy(lines: DiffLine[]): string {
  const chunks: string[] = [];

  for (const line of lines) {
    if (line.type === "equal") continue;

    if (line.type === "remove" && line.leftContent !== undefined) {
      chunks.push(`- ${line.leftContent}`);
    } else if (line.type === "add" && line.rightContent !== undefined) {
      chunks.push(`+ ${line.rightContent}`);
    } else if (line.type === "modify") {
      chunks.push(`- ${line.leftContent ?? ""}`);
      chunks.push(`+ ${line.rightContent ?? ""}`);
    }
  }

  return chunks.join("\n");
}
