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

export function detectCodeLanguage(left: string, right: string): string {
  const content = `${left}\n${right}`;

  if (/<\?php\b/i.test(content)) return "php";
  if (/\b(interface|type|enum|namespace)\s+[A-Za-z_$]/.test(content)) {
    return "typescript";
  }
  if (/\b(import|export)\s+type\b/.test(content)) return "typescript";
  if (/\b(private|public|protected|readonly)\s+[A-Za-z_$]/.test(content)) {
    return "typescript";
  }
  if (/\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*:\s*[A-Za-z_$]/.test(content)) {
    return "typescript";
  }
  if (/\b(def|class)\s+[A-Za-z_]\w*.*:\s*(?:\n|$)/.test(content)) {
    return "python";
  }
  if (/^\s*(?:from\s+\S+\s+import|import\s+\S+)/m.test(content)) {
    if (!/[;{}]|\bfrom\s+["']/.test(content)) return "python";
  }
  if (/<(?:!DOCTYPE|html|head|body|div|span|section)\b/i.test(content)) {
    return "html";
  }
  if (/^[.#]?[A-Za-z][\w-]*(?:\s+[.#]?[\w-]+)*\s*\{[^}]*:[^}]*\}/m.test(content)) {
    return "css";
  }
  if (/\b(import|export|function|const|let|var|class)\b/.test(content)) {
    return "javascript";
  }

  return "plaintext";
}

export function getMonacoLanguage(
  mode: CompareMode,
  leftFileName?: string,
  rightFileName?: string,
  original = "",
  modified = "",
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
      return detectCodeLanguage(original, modified);
    case "text":
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
      "diffEditor.diagonalFill": "#00000000",
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
      "diffEditor.diagonalFill": "#00000000",
    },
  });
}

export function getDevKitMonacoTheme(): "devkit-dark" | "devkit-light" {
  if (typeof document === "undefined") return "devkit-dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "devkit-light"
    : "devkit-dark";
}
