"use client";

import * as React from "react";
import { toast } from "sonner";

import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { PdfBase64Form } from "@/features/pdf-base64/components/pdf-base64-form";
import { PdfBase64Preview } from "@/features/pdf-base64/components/pdf-base64-preview";
import {
  formatBase64Output,
  isPdfFile,
  readFileAsDataUrl,
} from "@/features/pdf-base64/lib/convert-pdf";
import {
  LARGE_PDF_WARNING_BYTES,
  type PdfBase64Result,
  type PdfBase64Status,
} from "@/features/pdf-base64/types";

function PdfBase64Page() {
  const [includeMimePrefix, setIncludeMimePrefix] = React.useState(false);
  const [status, setStatus] = React.useState<PdfBase64Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [warning, setWarning] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>();
  const [fileSize, setFileSize] = React.useState<number>();
  const [result, setResult] = React.useState<PdfBase64Result | null>(null);

  const output = React.useMemo(() => {
    if (!result) return "";
    return formatBase64Output(result.dataUrl, includeMimePrefix);
  }, [result, includeMimePrefix]);

  const handleClear = React.useCallback(() => {
    setStatus("idle");
    setError(null);
    setWarning(null);
    setFileName(undefined);
    setFileSize(undefined);
    setResult(null);
  }, []);

  const handleFileSelect = React.useCallback(async (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);

    if (!isPdfFile(file)) {
      setError("Solo se permiten archivos PDF.");
      setWarning(null);
      setResult(null);
      setStatus("error");
      toast.error("El archivo seleccionado no es un PDF.");
      return;
    }

    const largeWarning =
      file.size >= LARGE_PDF_WARNING_BYTES
        ? "El archivo es grande. La conversión puede tardar y consumir memoria del navegador."
        : null;

    setError(null);
    setWarning(largeWarning);
    setStatus("converting");
    setResult(null);

    const startedAt = performance.now();

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const durationMs = Math.round(performance.now() - startedAt);

      setResult({
        fileName: file.name,
        fileSize: file.size,
        dataUrl,
        durationMs,
      });
      setStatus("done");
      toast.success("Conversión completada.");
    } catch {
      setStatus("error");
      setError("No se pudo convertir el archivo a Base64.");
      setResult(null);
      toast.error("Error al convertir el PDF.");
    }
  }, []);

  return (
    <ToolWorkspace
      form={
        <PdfBase64Form
          fileName={fileName}
          fileSize={fileSize}
          includeMimePrefix={includeMimePrefix}
          disabled={status === "converting"}
          error={error}
          warning={warning}
          onFileSelect={handleFileSelect}
          onIncludeMimePrefixChange={setIncludeMimePrefix}
        />
      }
      preview={
        <PdfBase64Preview
          status={status}
          output={output}
          result={result}
          onClear={handleClear}
        />
      }
    />
  );
}

export { PdfBase64Page };
