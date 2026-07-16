import type { CompareMode, CompareOptions, CompareResult } from "../types";

import { compareLists } from "./compare-lists";
import { compareJson } from "./compare-json";
import { prepareSqlForCompare } from "./compare-sql";
import { compareXml } from "./compare-xml";
import { diffText } from "./diff-lines";
import { normalizeTextForCompare } from "./normalize";

const SQL_PATTERN =
  /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|PROCEDURE|BEGIN|END)\b/i;
const CODE_PATTERN =
  /\b(function|class|const|let|var|import|export|<?php|public|private|protected)\b/i;

export function detectCompareMode(left: string, right: string): CompareMode {
  const combined = `${left}\n${right}`.trim();
  if (!combined) return "text";

  const leftJson = tryParseJson(left);
  const rightJson = tryParseJson(right);
  if (leftJson && rightJson) return "json";

  const trimmed = combined.trim();
  if (trimmed.startsWith("<") && trimmed.includes(">")) {
    return "xml";
  }

  if (SQL_PATTERN.test(combined)) {
    return "sql";
  }

  if (CODE_PATTERN.test(combined)) {
    return "code";
  }

  const leftLines = left.split("\n").filter((line) => line.trim());
  const rightLines = right.split("\n").filter((line) => line.trim());
  const maxLineLength = Math.max(
    0,
    ...leftLines.map((line) => line.trim().length),
    ...rightLines.map((line) => line.trim().length),
  );

  if (maxLineLength <= 64 && leftLines.length >= 2 && rightLines.length >= 2) {
    return "list";
  }

  return "text";
}

function tryParseJson(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

function compareTextLike(
  leftText: string,
  rightText: string,
  options: CompareOptions,
  kind: "text" | "code" | "sql",
  prepare?: (text: string) => string,
) {
  const preparedLeft = prepare ? prepare(leftText) : leftText;
  const preparedRight = prepare ? prepare(rightText) : rightText;
  const normalizedLeft = normalizeTextForCompare(preparedLeft, options);
  const normalizedRight = normalizeTextForCompare(preparedRight, options);
  const { lines, summary } = diffText(normalizedLeft, normalizedRight);

  return {
    kind,
    lines,
    summary,
    preparedLeft,
    preparedRight,
  };
}

export function runCompare(
  leftText: string,
  rightText: string,
  mode: CompareMode,
  options: CompareOptions,
): CompareResult | null {
  if (!leftText.trim() && !rightText.trim()) {
    return null;
  }

  const resolvedMode =
    mode === "auto" ? detectCompareMode(leftText, rightText) : mode;

  if (resolvedMode === "list") {
    return compareLists(leftText, rightText, options);
  }

  if (resolvedMode === "json") {
    return compareJson(leftText, rightText, options);
  }

  if (resolvedMode === "xml") {
    return compareXml(leftText, rightText, options);
  }

  if (resolvedMode === "sql") {
    const prepare = (text: string) =>
      prepareSqlForCompare(text, {
        ignoreSqlComments: options.ignoreSqlComments,
        formatBeforeCompare: options.formatBeforeCompare,
      });

    return compareTextLike(leftText, rightText, options, "sql", prepare);
  }

  if (resolvedMode === "text") {
    return compareTextLike(leftText, rightText, options, "text");
  }

  return compareTextLike(
    leftText,
    rightText,
    { ...options, ignoreLineBreaks: false },
    "code",
  );
}

export function getResolvedMode(
  mode: CompareMode,
  leftText: string,
  rightText: string,
): CompareMode {
  return mode === "auto" ? detectCompareMode(leftText, rightText) : mode;
}
