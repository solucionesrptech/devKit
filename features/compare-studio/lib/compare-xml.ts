import type { CompareOptions, TextCompareResult } from "../types";

import { diffText } from "./diff-lines";
import { normalizeTextForCompare } from "./normalize";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatXmlNode(node: Node, indent = 0): string {
  const spaces = "  ".repeat(indent);

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim() ?? "";
    return text ? `${spaces}${escapeXml(text)}\n` : "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as Element;
  const tagName = element.tagName;
  const attributes = [...element.attributes]
    .map((attr) => ` ${attr.name}="${escapeXml(attr.value)}"`)
    .join("");
  const children = [...element.childNodes]
    .map((child) => formatXmlNode(child, indent + 1))
    .join("")
    .trimEnd();

  if (!children) {
    return `${spaces}<${tagName}${attributes} />\n`;
  }

  return `${spaces}<${tagName}${attributes}>\n${children}\n${spaces}</${tagName}>\n`;
}

export function formatXml(text: string): { formatted: string; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) return { formatted: "" };

  if (typeof DOMParser === "undefined") {
    return { formatted: trimmed };
  }

  try {
    const parser = new DOMParser();
    const document = parser.parseFromString(trimmed, "application/xml");
    const parseError = document.querySelector("parsererror");

    if (parseError) {
      return {
        formatted: trimmed,
        error: parseError.textContent ?? "XML inválido",
      };
    }

    const root = document.documentElement;
    return {
      formatted: formatXmlNode(root).trimEnd(),
    };
  } catch (error) {
    return {
      formatted: trimmed,
      error: error instanceof Error ? error.message : "XML inválido",
    };
  }
}

export function compareXml(
  leftText: string,
  rightText: string,
  options: CompareOptions,
): TextCompareResult {
  const leftFormatted = formatXml(leftText);
  const rightFormatted = formatXml(rightText);

  const preparedLeft = leftFormatted.formatted;
  const preparedRight = rightFormatted.formatted;

  const normalizedLeft = normalizeTextForCompare(preparedLeft, options);
  const normalizedRight = normalizeTextForCompare(preparedRight, options);
  const { lines, summary } = diffText(normalizedLeft, normalizedRight);

  return {
    kind: "xml",
    lines,
    summary,
    preparedLeft,
    preparedRight,
  };
}
