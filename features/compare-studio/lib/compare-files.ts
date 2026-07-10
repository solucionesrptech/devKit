import { COMPARE_FILE_EXTENSIONS } from "../types";

const EXTENSION_MODE_MAP: Record<string, string> = {
  ".sql": "sql",
  ".json": "json",
  ".xml": "xml",
  ".php": "code",
  ".js": "code",
  ".ts": "code",
  ".tsx": "code",
  ".jsx": "code",
  ".txt": "code",
  ".md": "code",
  ".log": "code",
  ".csv": "list",
};

export function getAcceptedCompareExtensions(): string {
  return COMPARE_FILE_EXTENSIONS.join(",");
}

export function readCompareFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };

    reader.onerror = () => {
      reject(new Error("No pudimos leer el archivo."));
    };

    reader.readAsText(file);
  });
}

export function getExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) return "";
  return fileName.slice(dotIndex).toLowerCase();
}

export function suggestModeFromFileName(fileName: string): string | null {
  const extension = getExtension(fileName);
  return EXTENSION_MODE_MAP[extension] ?? null;
}

export function isSupportedCompareFile(fileName: string): boolean {
  const extension = getExtension(fileName);
  return COMPARE_FILE_EXTENSIONS.includes(
    extension as (typeof COMPARE_FILE_EXTENSIONS)[number],
  );
}
