"use client";

import { FileSpreadsheet, Upload, type LucideIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const DEFAULT_EXTENSIONS = [".xlsx", ".xls", ".csv"];

type FileDropzoneProps = {
  onFileSelect: (file: File) => void;
  fileName?: string;
  className?: string;
  disabled?: boolean;
  accept?: string[];
  formatsLabel?: string;
  fileIcon?: LucideIcon;
};

function FileDropzone({
  onFileSelect,
  fileName,
  className,
  disabled,
  accept = DEFAULT_EXTENSIONS,
  formatsLabel = "Formatos: .xlsx, .xls, .csv",
  fileIcon: FileIcon = FileSpreadsheet,
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFile = (file: File) => {
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-input px-6 py-10 text-center transition-colors",
          isDragging && "border-devkit-primary/50 bg-devkit-primary/5",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <Upload className="mb-3 h-8 w-8 text-muted" />
        <p className="text-sm font-medium text-foreground">
          Arrastra un archivo o haz clic para subir
        </p>
        <p className="mt-1 text-xs text-muted">{formatsLabel}</p>
        {fileName && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-sm">
            <FileIcon className="h-4 w-4 text-devkit-primary" />
            <span className="truncate text-muted">{fileName}</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export { FileDropzone };
