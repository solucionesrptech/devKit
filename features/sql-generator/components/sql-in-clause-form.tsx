"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  DataQualityReport,
  DuplicateEntry,
  ValueExtractionStats,
} from "@/features/sql-generator/lib/extract-values";
import type { ValueDataType } from "@/features/sql-generator/types";
import type { SqlTablePreset } from "@/lib/config/sql-presets";

import { DataQualityReportPanel } from "./data-quality-report-panel";
import { ExcelValuesInput } from "./excel-values-input";
import { RemoveDuplicatesOption } from "./remove-duplicates-option";
import { SqlTablePresetFields } from "./sql-table-preset-fields";
import { TextValuesInput } from "./text-values-input";
import type { ParsedSpreadsheet } from "../types";

type SqlInClauseFormProps = {
  tablePresetId: string;
  selectedPreset?: SqlTablePreset;
  table: string;
  whereColumn: string;
  dataType: ValueDataType;
  sourceTab: "text" | "file";
  rawText: string;
  parsedValues: string[];
  removeDuplicates: boolean;
  extractionQuality: DataQualityReport | null;
  extractionDuplicates: DuplicateEntry[];
  extractionStats: ValueExtractionStats | null;
  extractionError: string | null;
  fileName?: string;
  spreadsheet: ParsedSpreadsheet | null;
  selectedColumnIndex: number | null;
  fileError: string | null;
  onTablePresetChange: (presetId: string) => void;
  onTableChange: (value: string) => void;
  onWhereColumnChange: (value: string) => void;
  onDataTypeChange: (value: ValueDataType) => void;
  onSourceTabChange: (value: "text" | "file") => void;
  onRawTextChange: (value: string) => void;
  onRemoveDuplicatesChange: (checked: boolean) => void;
  onFileNameChange: (name: string | undefined) => void;
  onSpreadsheetChange: (spreadsheet: ParsedSpreadsheet | null) => void;
  onColumnIndexChange: (index: number | null) => void;
  onFileError: (message: string | null) => void;
};

function SqlInClauseForm({
  tablePresetId,
  selectedPreset,
  table,
  whereColumn,
  dataType,
  sourceTab,
  rawText,
  parsedValues,
  removeDuplicates,
  extractionQuality,
  extractionDuplicates,
  extractionStats,
  extractionError,
  fileName,
  spreadsheet,
  selectedColumnIndex,
  fileError,
  onTablePresetChange,
  onTableChange,
  onWhereColumnChange,
  onDataTypeChange,
  onSourceTabChange,
  onRawTextChange,
  onRemoveDuplicatesChange,
  onFileNameChange,
  onSpreadsheetChange,
  onColumnIndexChange,
  onFileError,
}: SqlInClauseFormProps) {
  const displayError = extractionError ?? fileError;

  return (
    <div className="space-y-5">
      <SqlTablePresetFields
        tablePresetId={tablePresetId}
        selectedPreset={selectedPreset}
        table={table}
        whereColumn={whereColumn}
        onTablePresetChange={onTablePresetChange}
        onTableChange={onTableChange}
        onWhereColumnChange={onWhereColumnChange}
      />

      <div className="space-y-2">
        <Label htmlFor="data-type">Tipo de dato</Label>
        <Select
          value={dataType}
          onValueChange={(v) => onDataTypeChange(v as ValueDataType)}
        >
          <SelectTrigger id="data-type" className="sm:max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="number">Número</SelectItem>
            <SelectItem value="text">Texto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Origen de datos</Label>
        <RemoveDuplicatesOption
          id="in-remove-duplicates"
          checked={removeDuplicates}
          onCheckedChange={onRemoveDuplicatesChange}
        />
        <Tabs
          value={sourceTab}
          onValueChange={(v) => onSourceTabChange(v as "text" | "file")}
        >
          <TabsList className="w-full">
            <TabsTrigger value="text" className="flex-1">
              Pegar texto
            </TabsTrigger>
            <TabsTrigger value="file" className="flex-1">
              Excel / CSV
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-4">
            <TextValuesInput
              value={rawText}
              onChange={onRawTextChange}
              valueCount={parsedValues.length}
            />
          </TabsContent>

          <TabsContent value="file" className="mt-4">
            <ExcelValuesInput
              fileName={fileName}
              spreadsheet={spreadsheet}
              selectedColumnIndex={selectedColumnIndex}
              onSpreadsheetChange={onSpreadsheetChange}
              onFileNameChange={onFileNameChange}
              onColumnIndexChange={onColumnIndexChange}
              onError={onFileError}
            />
            {sourceTab === "file" &&
              spreadsheet &&
              selectedColumnIndex === null && (
                <p className="mt-3 text-sm text-muted">
                  Selecciona la columna a utilizar.
                </p>
              )}
          </TabsContent>
        </Tabs>

        <DataQualityReportPanel
          quality={extractionQuality}
          duplicates={extractionDuplicates}
          removeDuplicates={removeDuplicates}
          omittedDuplicates={extractionStats?.omittedDuplicates}
        />

        {displayError && (
          <p className="text-sm text-amber-400">{displayError}</p>
        )}
      </div>
    </div>
  );
}

export type { SqlInClauseFormProps };
export { SqlInClauseForm };
