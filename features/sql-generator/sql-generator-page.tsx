"use client";

import * as React from "react";

import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { generateSql } from "@/features/sql-generator/lib/generate-sql";
import { generateUpdateSql } from "@/features/sql-generator/lib/generate-update-sql";
import {
  extractColumnValues,
} from "@/features/sql-generator/lib/parse-spreadsheet";
import { parseValuesFromText } from "@/features/sql-generator/lib/parse-values";
import type { DuplicateEntry } from "@/features/sql-generator/lib/extract-values";
import {
  createAssignmentRow,
  rowsToAssignments,
  type UpdateAssignmentRow,
} from "@/features/sql-generator/lib/update-assignment-rows";
import {
  CUSTOM_TABLE_PRESET_ID,
  getSqlTablePreset,
} from "@/lib/config/sql-presets";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import {
  DEFAULT_UPDATE_VALIDATION_OPTIONS,
  type ParsedSpreadsheet,
  type SqlDialect,
  type SqlOperation,
  type UpdateGenerationMode,
  type UpdateValidationOptions,
  type ValueDataType,
} from "@/features/sql-generator/types";

import { SqlGeneratorForm } from "./components/sql-generator-form";
import { SqlPreviewPanel } from "./components/sql-preview-panel";

const LARGE_LIST_THRESHOLD = 500;

const EMPTY_EXTRACTION = {
  values: [] as string[],
  quality: null,
  duplicates: [] as DuplicateEntry[],
  stats: null,
  error: null as string | null,
};

function SqlGeneratorPage() {
  const [operation, setOperation] = React.useState<SqlOperation>("SELECT");
  const [dialect, setDialect] = React.useState<SqlDialect>("sqlserver");
  const [tablePresetId, setTablePresetId] = React.useState(
    CUSTOM_TABLE_PRESET_ID,
  );
  const [table, setTable] = React.useState("");
  const [whereColumn, setWhereColumn] = React.useState("");
  const [dataType, setDataType] = React.useState<ValueDataType>("number");
  const [whereDataType, setWhereDataType] =
    React.useState<ValueDataType>("text");
  const [assignmentRows, setAssignmentRows] = React.useState<
    UpdateAssignmentRow[]
  >(() => [createAssignmentRow()]);

  const [inSourceTab, setInSourceTab] = React.useState<"text" | "file">("text");
  const [rawText, setRawText] = React.useState("");
  const [removeDuplicatesIn, setRemoveDuplicatesIn] = React.useState(false);
  const debouncedRawText = useDebouncedValue(rawText, 300);
  const [inFileName, setInFileName] = React.useState<string>();
  const [inSpreadsheet, setInSpreadsheet] =
    React.useState<ParsedSpreadsheet | null>(null);
  const [inSelectedColumnIndex, setInSelectedColumnIndex] = React.useState<
    number | null
  >(null);
  const [inFileError, setInFileError] = React.useState<string | null>(null);

  const [updateSourceTab, setUpdateSourceTab] = React.useState<
    "text" | "file"
  >("text");
  const [updateRawText, setUpdateRawText] = React.useState("");
  const [removeDuplicatesUpdate, setRemoveDuplicatesUpdate] =
    React.useState(false);
  const debouncedUpdateRawText = useDebouncedValue(updateRawText, 300);
  const [updateFileName, setUpdateFileName] = React.useState<string>();
  const [updateSpreadsheet, setUpdateSpreadsheet] =
    React.useState<ParsedSpreadsheet | null>(null);
  const [updateSelectedColumnIndex, setUpdateSelectedColumnIndex] =
    React.useState<number | null>(null);
  const [updateFileError, setUpdateFileError] = React.useState<string | null>(
    null,
  );
  const [updateGenerationMode, setUpdateGenerationMode] =
    React.useState<UpdateGenerationMode>("auto");
  const [updateValidationOptions, setUpdateValidationOptions] =
    React.useState<UpdateValidationOptions>(DEFAULT_UPDATE_VALIDATION_OPTIONS);

  const inTextExtraction = React.useMemo(
    () => parseValuesFromText(debouncedRawText, removeDuplicatesIn),
    [debouncedRawText, removeDuplicatesIn],
  );

  const inFileExtraction = React.useMemo(() => {
    if (!inSpreadsheet || inSelectedColumnIndex === null) {
      return EMPTY_EXTRACTION;
    }
    const result = extractColumnValues(
      inSpreadsheet,
      inSelectedColumnIndex,
      removeDuplicatesIn,
    );
    return {
      values: result.values,
      quality: result.quality,
      duplicates: result.duplicates,
      stats: result.stats,
      error: result.error,
    };
  }, [inSpreadsheet, inSelectedColumnIndex, removeDuplicatesIn]);

  const inExtraction =
    inSourceTab === "text" ? inTextExtraction : inFileExtraction;

  const updateTextExtraction = React.useMemo(
    () => parseValuesFromText(debouncedUpdateRawText, removeDuplicatesUpdate),
    [debouncedUpdateRawText, removeDuplicatesUpdate],
  );

  const updateFileExtraction = React.useMemo(() => {
    if (!updateSpreadsheet || updateSelectedColumnIndex === null) {
      return EMPTY_EXTRACTION;
    }
    const result = extractColumnValues(
      updateSpreadsheet,
      updateSelectedColumnIndex,
      removeDuplicatesUpdate,
    );
    return {
      values: result.values,
      quality: result.quality,
      duplicates: result.duplicates,
      stats: result.stats,
      error: result.error,
    };
  }, [updateSpreadsheet, updateSelectedColumnIndex, removeDuplicatesUpdate]);

  const updateExtraction =
    updateSourceTab === "text" ? updateTextExtraction : updateFileExtraction;

  const activeValues = inExtraction.values;
  const activeWhereValues = updateExtraction.values;

  const deferredActiveValues = React.useDeferredValue(activeValues);
  const deferredActiveWhereValues = React.useDeferredValue(activeWhereValues);

  const valuesForGeneration = React.useMemo(
    () =>
      activeValues.length >= LARGE_LIST_THRESHOLD
        ? deferredActiveValues
        : activeValues,
    [activeValues, deferredActiveValues],
  );

  const whereValuesForGeneration = React.useMemo(
    () =>
      activeWhereValues.length >= LARGE_LIST_THRESHOLD
        ? deferredActiveWhereValues
        : activeWhereValues,
    [activeWhereValues, deferredActiveWhereValues],
  );

  const assignments = React.useMemo(
    () => rowsToAssignments(assignmentRows),
    [assignmentRows],
  );

  const valueCount = React.useMemo(() => {
    if (operation === "UPDATE") {
      return activeWhereValues.length;
    }
    return activeValues.length;
  }, [operation, activeWhereValues.length, activeValues.length]);

  const activeExtractionStats =
    operation === "UPDATE" ? updateExtraction.stats : inExtraction.stats;

  const activeExtractionQuality =
    operation === "UPDATE" ? updateExtraction.quality : inExtraction.quality;

  const activeExtractionDuplicates =
    operation === "UPDATE"
      ? updateExtraction.duplicates
      : inExtraction.duplicates;

  const activeRemoveDuplicates =
    operation === "UPDATE" ? removeDuplicatesUpdate : removeDuplicatesIn;

  const selectedPreset = React.useMemo(
    () => getSqlTablePreset(tablePresetId),
    [tablePresetId],
  );

  const handleTablePresetChange = (presetId: string) => {
    setTablePresetId(presetId);

    if (presetId === CUSTOM_TABLE_PRESET_ID) {
      return;
    }

    const preset = getSqlTablePreset(presetId);
    if (preset) {
      setTable(preset.table);
      setWhereColumn(preset.defaultKey);
    }
  };

  const handleInSourceTabChange = (tab: "text" | "file") => {
    setInSourceTab(tab);
    if (tab === "text") {
      setInFileError(null);
    }
  };

  const handleUpdateSourceTabChange = (tab: "text" | "file") => {
    setUpdateSourceTab(tab);
    if (tab === "text") {
      setUpdateFileError(null);
    }
  };

  const result = React.useMemo(() => {
    if (operation === "UPDATE") {
      if (
        updateSourceTab === "file" &&
        updateSpreadsheet &&
        updateSelectedColumnIndex === null
      ) {
        return {
          sql: null,
          message: "Selecciona la columna WHERE del archivo.",
        };
      }

      if (updateSourceTab === "file" && updateFileError) {
        return { sql: null, message: updateFileError };
      }

      if (updateExtraction.error) {
        return { sql: null, message: updateExtraction.error };
      }

      return generateUpdateSql({
        dialect,
        table,
        whereColumn,
        whereDataType,
        whereValues: whereValuesForGeneration,
        assignments,
        generationMode: updateGenerationMode,
        validationOptions: updateValidationOptions,
      });
    }

    if (
      inSourceTab === "file" &&
      inSpreadsheet &&
      inSelectedColumnIndex === null
    ) {
      return {
        sql: null,
        message: "Selecciona la columna a utilizar.",
      };
    }

    if (inSourceTab === "file" && inFileError) {
      return { sql: null, message: inFileError };
    }

    if (inExtraction.error) {
      return { sql: null, message: inExtraction.error };
    }

    return generateSql({
      operation,
      dialect,
      table,
      whereColumn,
      dataType,
      values: valuesForGeneration,
    });
  }, [
    operation,
    dialect,
    table,
    whereColumn,
    whereDataType,
    assignments,
    whereValuesForGeneration,
    valuesForGeneration,
    dataType,
    inSourceTab,
    inSpreadsheet,
    inSelectedColumnIndex,
    inFileError,
    inExtraction.error,
    updateSourceTab,
    updateSpreadsheet,
    updateSelectedColumnIndex,
    updateFileError,
    updateExtraction.error,
    updateGenerationMode,
    updateValidationOptions,
  ]);

  const sqlGeneratedCount =
    result.generationMeta?.recordCount ??
    result.updateMeta?.recordCount ??
    undefined;

  return (
    <ToolWorkspace
      form={
        <SqlGeneratorForm
          operation={operation}
          dialect={dialect}
          onOperationChange={setOperation}
          onDialectChange={setDialect}
          inClauseForm={{
            tablePresetId,
            selectedPreset,
            table,
            whereColumn,
            dataType,
            sourceTab: inSourceTab,
            rawText,
            parsedValues: activeValues,
            removeDuplicates: removeDuplicatesIn,
            extractionQuality: inExtraction.quality,
            extractionDuplicates: inExtraction.duplicates,
            extractionStats: inExtraction.stats,
            extractionError: inExtraction.error,
            fileName: inFileName,
            spreadsheet: inSpreadsheet,
            selectedColumnIndex: inSelectedColumnIndex,
            fileError: inFileError,
            onTablePresetChange: handleTablePresetChange,
            onTableChange: setTable,
            onWhereColumnChange: setWhereColumn,
            onDataTypeChange: setDataType,
            onSourceTabChange: handleInSourceTabChange,
            onRawTextChange: setRawText,
            onRemoveDuplicatesChange: setRemoveDuplicatesIn,
            onFileNameChange: setInFileName,
            onSpreadsheetChange: setInSpreadsheet,
            onColumnIndexChange: setInSelectedColumnIndex,
            onFileError: setInFileError,
          }}
          updateForm={{
            tablePresetId,
            selectedPreset,
            table,
            whereColumn,
            whereDataType,
            assignmentRows,
            sourceTab: updateSourceTab,
            rawText: updateRawText,
            whereValueCount: activeWhereValues.length,
            removeDuplicates: removeDuplicatesUpdate,
            extractionQuality: updateExtraction.quality,
            extractionDuplicates: updateExtraction.duplicates,
            extractionStats: updateExtraction.stats,
            extractionError: updateExtraction.error,
            fileName: updateFileName,
            spreadsheet: updateSpreadsheet,
            selectedColumnIndex: updateSelectedColumnIndex,
            fileError: updateFileError,
            generationMode: updateGenerationMode,
            validationOptions: updateValidationOptions,
            onTablePresetChange: handleTablePresetChange,
            onTableChange: setTable,
            onWhereColumnChange: setWhereColumn,
            onWhereDataTypeChange: setWhereDataType,
            onAssignmentRowsChange: setAssignmentRows,
            onSourceTabChange: handleUpdateSourceTabChange,
            onRawTextChange: setUpdateRawText,
            onRemoveDuplicatesChange: setRemoveDuplicatesUpdate,
            onFileNameChange: setUpdateFileName,
            onSpreadsheetChange: setUpdateSpreadsheet,
            onColumnIndexChange: setUpdateSelectedColumnIndex,
            onFileError: setUpdateFileError,
            onGenerationModeChange: setUpdateGenerationMode,
            onValidationOptionsChange: setUpdateValidationOptions,
          }}
        />
      }
      preview={
        <SqlPreviewPanel
          sql={result.sql}
          previewSql={"previewSql" in result ? result.previewSql : undefined}
          message={result.message}
          valueCount={valueCount}
          operation={operation}
          table={table}
          whereColumn={whereColumn}
          generationMeta={
            "generationMeta" in result ? result.generationMeta : undefined
          }
          updateMeta={"updateMeta" in result ? result.updateMeta : undefined}
          extractionQuality={activeExtractionQuality}
          extractionDuplicates={activeExtractionDuplicates}
          sqlGeneratedCount={sqlGeneratedCount}
          removeDuplicates={activeRemoveDuplicates}
          omittedDuplicates={activeExtractionStats?.omittedDuplicates}
          validationOptions={
            operation === "UPDATE" ? updateValidationOptions : undefined
          }
          validationBlocks={
            "validationBlocks" in result ? result.validationBlocks : undefined
          }
        />
      }
    />
  );
}

export { SqlGeneratorPage };
