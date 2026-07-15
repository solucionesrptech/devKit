import { PDF_MIME_PREFIX } from "@/features/pdf-base64/types";

export function isPdfFile(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return true;
  return file.type === "application/pdf";
}

export function stripDataUrlPrefix(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) return dataUrl;
  return dataUrl.slice(commaIndex + 1);
}

export function formatBase64Output(
  dataUrl: string,
  includeMimePrefix: boolean,
): string {
  if (includeMimePrefix) {
    if (dataUrl.startsWith("data:")) return dataUrl;
    return `${PDF_MIME_PREFIX}${dataUrl}`;
  }
  return stripDataUrlPrefix(dataUrl);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("No se pudo leer el archivo como texto."));
    };
    reader.onerror = () => {
      reject(new Error("Error al leer el archivo."));
    };
    reader.readAsDataURL(file);
  });
}

export function downloadTextFile(content: string, fileName: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function buildTxtFileName(pdfFileName: string): string {
  const base = pdfFileName.replace(/\.pdf$/i, "");
  return `${base || "pdf"}-base64.txt`;
}
