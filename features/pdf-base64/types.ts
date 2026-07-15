export type PdfBase64Status = "idle" | "converting" | "done" | "error";

export type PdfBase64Result = {
  fileName: string;
  fileSize: number;
  dataUrl: string;
  durationMs: number;
};

export const PDF_MIME_PREFIX = "data:application/pdf;base64,";
export const LARGE_PDF_WARNING_BYTES = 5 * 1024 * 1024;
