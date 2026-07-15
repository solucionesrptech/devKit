"use client";

import { Download, Eraser } from "lucide-react";

import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildTxtFileName,
  downloadTextFile,
  formatFileSize,
} from "@/features/pdf-base64/lib/convert-pdf";
import type { PdfBase64Result, PdfBase64Status } from "@/features/pdf-base64/types";

type PdfBase64PreviewProps = {
  status: PdfBase64Status;
  output: string;
  result: PdfBase64Result | null;
  onClear: () => void;
};

function PdfBase64Preview({
  status,
  output,
  result,
  onClear,
}: PdfBase64PreviewProps) {
  const hasOutput = Boolean(output);
  const placeholder =
    status === "converting"
      ? "Convirtiendo..."
      : "El Base64 del PDF aparecerá aquí.";

  const handleDownload = () => {
    if (!output || !result) return;
    downloadTextFile(output, buildTxtFileName(result.fileName));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base">Base64</CardTitle>
          {status === "converting" && (
            <p className="text-xs text-muted">Convirtiendo...</p>
          )}
          {status === "done" && result && (
            <p className="text-xs text-muted">
              Conversión completada · {result.fileName} ·{" "}
              {formatFileSize(result.fileSize)} · {result.durationMs} ms
            </p>
          )}
          {status === "idle" && (
            <p className="text-xs text-muted">
              Sube un PDF para generar la cadena Base64.
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          readOnly
          value={output}
          placeholder={placeholder}
          rows={16}
          className="flex min-h-[320px] w-full resize-y rounded-lg border border-border bg-input px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="flex flex-wrap gap-2">
          <CopyButton
            text={output || null}
            label="Copiar"
            successMessage="Base64 copiado al portapapeles"
            disabled={!hasOutput}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleDownload}
            disabled={!hasOutput}
          >
            <Download className="h-4 w-4" />
            Descargar TXT
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClear}
            disabled={status === "idle" && !hasOutput}
          >
            <Eraser className="h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { PdfBase64Preview };
