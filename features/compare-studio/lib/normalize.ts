import type { CompareOptions } from "../types";

export function splitLines(text: string): string[] {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (normalized.endsWith("\n")) {
    return normalized.slice(0, -1).split("\n");
  }
  return normalized.split("\n");
}

export function normalizeLine(line: string, options: CompareOptions): string {
  let result = line;

  if (options.ignoreSqlComments) {
    result = result.replace(/--.*$/, "").replace(/\/\*.*?\*\//g, "");
  }

  if (options.ignoreWhitespace) {
    result = result.replace(/\s+/g, " ").trim();
  }

  if (options.ignoreCase) {
    result = result.toLowerCase();
  }

  return result;
}

export function normalizeTextForCompare(
  text: string,
  options: CompareOptions,
): string {
  if (options.ignoreLineBreaks) {
    const singleLine = splitLines(text).join(" ");
    return normalizeLine(singleLine, options);
  }

  return splitLines(text)
    .filter((line) => !options.ignoreEmptyLines || line.trim().length > 0)
    .map((line) => normalizeLine(line, options))
    .join("\n");
}
