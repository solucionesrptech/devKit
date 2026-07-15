"use client";

import { FileText } from "lucide-react";

import { FileDropzone } from "@/components/shared/file-dropzone";
import { Label } from "@/components/ui/label";
import { formatFileSize } from "@/features/pdf-base64/lib/convert-pdf";
import { LARGE_PDF_WARNING_BYTES } from "@/features/pdf-base64/types";

type PdfBase64FormProps = {
  fileName?: string;
  fileSize?: number;
  includeMimePrefix: boolean;
  disabled?: boolean;
  error?: string | null;
  warning?: string | null;
  onFileSelect: (file: File) => void;
  onIncludeMimePrefixChange: (value: boolean) => void;
};

function PdfBase64Form({
  fileName,
  fileSize,
  includeMimePrefix,
  disabled,
  error,
  warning,
  onFileSelect,
  onIncludeMimePrefixChange,
}: PdfBase64FormProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Archivo PDF</Label>
        <FileDropzone
          onFileSelect={onFileSelect}
          fileName={fileName}
          disabled={disabled}
          accept={[".pdf", "application/pdf"]}
          formatsLabel="Formato: .pdf"
          fileIcon={FileText}
        />
      </div>

      {fileName && fileSize !== undefined && (
        <p className="text-xs text-muted">
          {fileName} · {formatFileSize(fileSize)}
          {fileSize >= LARGE_PDF_WARNING_BYTES && (
            <span className="text-amber-400/90">
              {" "}
              · Archivo grande (&gt; 5 MB)
            </span>
          )}
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {warning && !error && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {warning}
        </p>
      )}

      <div className="space-y-2">
        <Label>Opciones</Label>
        <label
          htmlFor="include-mime-prefix"
          className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
        >
          <input
            id="include-mime-prefix"
            type="checkbox"
            checked={includeMimePrefix}
            onChange={(e) => onIncludeMimePrefixChange(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Incluir prefijo MIME
        </label>
        <p className="text-xs text-muted">
          Si está activo, el resultado incluye{" "}
          <code className="text-foreground">data:application/pdf;base64,</code>
        </p>
      </div>
    </div>
  );
}

export { PdfBase64Form };
