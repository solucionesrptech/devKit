import type { CompareMode } from "../types";

const EXTENSION_LANGUAGE: Record<string, string> = {
  ".sql": "sql",
  ".json": "json",
  ".xml": "xml",
  ".php": "php",
  ".js": "javascript",
  ".jsx": "javascript",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".md": "markdown",
  ".csv": "plaintext",
  ".txt": "plaintext",
  ".log": "plaintext",
};

export function getMonacoLanguage(
  mode: CompareMode,
  leftFileName?: string,
  rightFileName?: string,
): string {
  const fromFile = [rightFileName, leftFileName]
    .filter(Boolean)
    .map((name) => {
      const dotIndex = name!.lastIndexOf(".");
      if (dotIndex === -1) return null;
      return EXTENSION_LANGUAGE[name!.slice(dotIndex).toLowerCase()];
    })
    .find(Boolean);

  if (fromFile) return fromFile;

  switch (mode) {
    case "sql":
      return "sql";
    case "json":
      return "json";
    case "xml":
      return "xml";
    case "code":
      return "plaintext";
    default:
      return "plaintext";
  }
}

export function defineDevKitMonacoThemes(monaco: typeof import("monaco-editor")) {
  monaco.editor.defineTheme("devkit-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "diffEditor.insertedTextBackground": "#22c55e33",
      "diffEditor.removedTextBackground": "#ef444433",
      "diffEditor.insertedLineBackground": "#22c55e22",
      "diffEditor.removedLineBackground": "#ef444422",
    },
  });

  monaco.editor.defineTheme("devkit-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "diffEditor.insertedTextBackground": "#22c55e26",
      "diffEditor.removedTextBackground": "#ef444426",
      "diffEditor.insertedLineBackground": "#22c55e18",
      "diffEditor.removedLineBackground": "#ef444418",
    },
  });
}

export function getDevKitMonacoTheme(): "devkit-dark" | "devkit-light" {
  if (typeof document === "undefined") return "devkit-dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "devkit-light"
    : "devkit-dark";
}
