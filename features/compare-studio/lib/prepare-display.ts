import type { CompareMode, CompareOptions } from "../types";

import { formatXml } from "./compare-xml";
import { prepareSqlForCompare } from "./compare-sql";
import { normalizeTextForCompare } from "./normalize";

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

  const effectiveOptions = {
    ...options,
    ignoreLineBreaks: mode === "text" && options.ignoreLineBreaks,
  };

  return normalizeTextForCompare(prepared, effectiveOptions);
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
