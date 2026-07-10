"use client";

import * as React from "react";

import { FileDropzone } from "@/components/shared/file-dropzone";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseSpreadsheetFile } from "@/features/sql-generator/lib/parse-spreadsheet";
import type { ParsedSpreadsheet } from "@/features/sql-generator/types";

type ExcelUpdateInputProps = {
  fileName?: string;
  spreadsheet: ParsedSpreadsheet | null;
  selectedColumnIndex: number | null;
  onSpreadsheetChange: (spreadsheet: ParsedSpreadsheet | null) => void;
  onFileNameChange: (name: string | undefined) => void;
  onColumnIndexChange: (index: number | null) => void;
  onError: (message: string | null) => void;
};

function ExcelUpdateInput({
  fileName,
  spreadsheet,
  selectedColumnIndex,
  onSpreadsheetChange,
  onFileNameChange,
  onColumnIndexChange,
  onError,
}: ExcelUpdateInputProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    onError(null);
    onFileNameChange(file.name);
    onColumnIndexChange(null);

    try {
      const parsed = await parseSpreadsheetFile(file);
      onSpreadsheetChange(parsed);
    } catch {
      onSpreadsheetChange(null);
      onError("No pudimos leer el archivo. Prueba con .xlsx, .xls o .csv.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleColumnChange = (value: string) => {
    if (!spreadsheet) return;

    const index = Number(value);
    onColumnIndexChange(index);
    onError(null);
  };

  return (
    <div className="space-y-4">
      <FileDropzone
        onFileSelect={handleFileSelect}
        fileName={fileName}
        disabled={isLoading}
      />

      {spreadsheet && spreadsheet.columns.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="excel-update-where-column">Columna WHERE</Label>
          <Select
            value={
              selectedColumnIndex !== null
                ? String(selectedColumnIndex)
                : undefined
            }
            onValueChange={handleColumnChange}
          >
            <SelectTrigger id="excel-update-where-column">
              <SelectValue placeholder="Elige la columna WHERE" />
            </SelectTrigger>
            <SelectContent>
              {spreadsheet.columns.map((column) => (
                <SelectItem key={column.index} value={String(column.index)}>
                  {column.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

export { ExcelUpdateInput };
