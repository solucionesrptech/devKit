"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createAssignmentRow,
  type UpdateAssignmentRow,
} from "@/features/sql-generator/lib/update-assignment-rows";
import type {
  DataQualityReport,
  DuplicateEntry,
  ValueExtractionStats,
} from "@/features/sql-generator/lib/extract-values";
import type {
  UpdateGenerationMode,
  UpdateValidationOptions,
  ValueDataType,
} from "@/features/sql-generator/types";
import {
  CUSTOM_TABLE_PRESET_ID,
  type SqlTablePreset,
} from "@/lib/config/sql-presets";

import { DataQualityReportPanel } from "./data-quality-report-panel";
import { ExcelUpdateInput } from "./excel-update-input";
import { RemoveDuplicatesOption } from "./remove-duplicates-option";
import { SqlTablePresetFields } from "./sql-table-preset-fields";
import { TextUpdateInput } from "./text-update-input";
import { UpdateAssignmentsTable } from "./update-assignments-table";
import { UpdateValidationOptionsPanel } from "./update-validation-options";
import type { ParsedSpreadsheet } from "../types";

type SqlUpdateFormProps = {
  tablePresetId: string;
  selectedPreset?: SqlTablePreset;
  table: string;
  whereColumn: string;
  whereDataType: ValueDataType;
  assignmentRows: UpdateAssignmentRow[];
  sourceTab: "text" | "file";
  rawText: string;
  whereValueCount: number;
  removeDuplicates: boolean;
  extractionQuality: DataQualityReport | null;
  extractionDuplicates: DuplicateEntry[];
  extractionStats: ValueExtractionStats | null;
  extractionError: string | null;
  fileName?: string;
  spreadsheet: ParsedSpreadsheet | null;
  selectedColumnIndex: number | null;
  fileError: string | null;
  generationMode: UpdateGenerationMode;
  validationOptions: UpdateValidationOptions;
  onTablePresetChange: (presetId: string) => void;
  onTableChange: (value: string) => void;
  onWhereColumnChange: (value: string) => void;
  onWhereDataTypeChange: (value: ValueDataType) => void;
  onAssignmentRowsChange: (rows: UpdateAssignmentRow[]) => void;
  onSourceTabChange: (value: "text" | "file") => void;
  onRawTextChange: (value: string) => void;
  onRemoveDuplicatesChange: (checked: boolean) => void;
  onFileNameChange: (name: string | undefined) => void;
  onSpreadsheetChange: (spreadsheet: ParsedSpreadsheet | null) => void;
  onColumnIndexChange: (index: number | null) => void;
  onFileError: (message: string | null) => void;
  onGenerationModeChange: (mode: UpdateGenerationMode) => void;
  onValidationOptionsChange: (options: UpdateValidationOptions) => void;
};

function SqlUpdateForm({
  tablePresetId,
  selectedPreset,
  table,
  whereColumn,
  whereDataType,
  assignmentRows,
  sourceTab,
  rawText,
  whereValueCount,
  removeDuplicates,
  extractionQuality,
  extractionDuplicates,
  extractionStats,
  extractionError,
  fileName,
  spreadsheet,
  selectedColumnIndex,
  fileError,
  generationMode,
  validationOptions,
  onTablePresetChange,
  onTableChange,
  onWhereColumnChange,
  onWhereDataTypeChange,
  onAssignmentRowsChange,
  onSourceTabChange,
  onRawTextChange,
  onRemoveDuplicatesChange,
  onFileNameChange,
  onSpreadsheetChange,
  onColumnIndexChange,
  onFileError,
  onGenerationModeChange,
  onValidationOptionsChange,
}: SqlUpdateFormProps) {
  const isCustomTable = tablePresetId === CUSTOM_TABLE_PRESET_ID;
  const displayError = extractionError ?? fileError;

  const handleAddRow = () => {
    onAssignmentRowsChange([...assignmentRows, createAssignmentRow()]);
  };

  const handleRemoveRow = (id: string) => {
    if (assignmentRows.length <= 1) return;
    onAssignmentRowsChange(assignmentRows.filter((row) => row.id !== id));
  };

  const handleRowChange = (
    id: string,
    patch: Partial<Pick<UpdateAssignmentRow, "column" | "value" | "dataType">>,
  ) => {
    onAssignmentRowsChange(
      assignmentRows.map((row) => {
        if (row.id !== id) return row;

        const nextDataType = patch.dataType ?? row.dataType;
        const nextValue =
          nextDataType === "null" ? "" : (patch.value ?? row.value);

        return {
          ...row,
          ...patch,
          dataType: nextDataType,
          value: nextValue,
        };
      }),
    );
  };

  return (
    <div className="space-y-5">
      <SqlTablePresetFields
        tablePresetId={tablePresetId}
        selectedPreset={selectedPreset}
        table={table}
        whereColumn={whereColumn}
        includeWhereColumn={false}
        onTablePresetChange={onTablePresetChange}
        onTableChange={onTableChange}
        onWhereColumnChange={onWhereColumnChange}
      />

      <UpdateAssignmentsTable
        rows={assignmentRows}
        presetColumns={selectedPreset?.columns}
        isCustomTable={isCustomTable}
        onAddRow={handleAddRow}
        onRemoveRow={handleRemoveRow}
        onRowChange={handleRowChange}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="update-where-column">Columna WHERE</Label>
          {isCustomTable ? (
            <Input
              id="update-where-column"
              value={whereColumn}
              onChange={(e) => onWhereColumnChange(e.target.value)}
              placeholder="id"
            />
          ) : (
            <Select value={whereColumn} onValueChange={onWhereColumnChange}>
              <SelectTrigger id="update-where-column">
                <SelectValue placeholder="Selecciona columna" />
              </SelectTrigger>
              <SelectContent>
                {selectedPreset?.columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="where-data-type">Tipo de dato WHERE</Label>
          <Select
            value={whereDataType}
            onValueChange={(v) => onWhereDataTypeChange(v as ValueDataType)}
          >
            <SelectTrigger id="where-data-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Número</SelectItem>
              <SelectItem value="text">Texto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="update-generation-mode">Modo de generación</Label>
        <Select
          value={generationMode}
          onValueChange={(value) =>
            onGenerationModeChange(value as UpdateGenerationMode)
          }
        >
          <SelectTrigger id="update-generation-mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Automático (recomendado)</SelectItem>
            <SelectItem value="per-row">Un UPDATE por fila</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted">
          {generationMode === "auto"
            ? "Usa WHERE IN cuando el SET es igual para todos los registros."
            : "Genera una sentencia UPDATE por cada registro."}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Validación</Label>
        <UpdateValidationOptionsPanel
          options={validationOptions}
          onChange={onValidationOptionsChange}
        />
        <p className="text-xs text-muted">
          Los SELECT de validación usan WHERE IN con todos los valores. El
          UPDATE respeta el modo Automático o por fila.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Origen de datos</Label>
        <RemoveDuplicatesOption
          id="update-remove-duplicates"
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
            <TextUpdateInput
              value={rawText}
              onChange={onRawTextChange}
              valueCount={whereValueCount}
            />
          </TabsContent>

          <TabsContent value="file" className="mt-4">
            <ExcelUpdateInput
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
                  Selecciona la columna WHERE del archivo.
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

export type { SqlUpdateFormProps };
export { SqlUpdateForm };
