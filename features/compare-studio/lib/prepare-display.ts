import type { CompareMode, CompareOptions } from "../types";

import { formatXml } from "./compare-xml";
import { prepareSqlForCompare } from "./compare-sql";
import { splitLines } from "./normalize";

export function prepareDisplayText(
  text: string,
  mode: CompareMode,
  options: CompareOptions,
): string {
  let prepared = text;

  if (mode === "sql") {
    prepared = prepareSqlForCompare(prepared, {
      ignoreSqlComments: options.ignoreSqlComments,
      formatBeforeCompare: options.formatBeforeCompare,
    });
  }

  if (mode === "json") {
    try {
      prepared = JSON.stringify(JSON.parse(prepared), null, 2);
    } catch {
      prepared = text;
    }
  }

  if (mode === "xml") {
    prepared = formatXml(prepared).formatted;
  }

  let lines = splitLines(prepared);

  if (options.ignoreEmptyLines) {
    lines = lines.filter((line) => line.trim().length > 0);
  }

  if (options.ignoreCase) {
    lines = lines.map((line) => line.toLowerCase());
  }

  if (options.ignoreWhitespace) {
    lines = lines.map((line) => line.replace(/\s+/g, " ").trim());
  }

  return lines.join("\n");
}

export function getDiffTexts(
  leftText: string,
  rightText: string,
  mode: CompareMode,
  options: CompareOptions,
): { original: string; modified: string } {
  return {
    original: prepareDisplayText(leftText, mode, options),
    modified: prepareDisplayText(rightText, mode, options),
  };
}
