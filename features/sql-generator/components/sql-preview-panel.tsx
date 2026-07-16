"use client";

import { AlertTriangle } from "lucide-react";
import * as React from "react";

import { CopyButton } from "@/components/shared/copy-button";
import { SqlPreview } from "@/components/shared/sql-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DataQualityReport } from "@/features/sql-generator/lib/extract-values";
import {
  PREVIEW_MAX_IN_LINES,
  truncateSqlPreview,
} from "@/features/sql-generator/lib/truncate-sql-preview";
import type {
  SqlGenerationMeta,
  SqlOperation,
  UpdateGenerationType,
  UpdateValidationBlocks,
  UpdateValidationOptions,
} from "@/features/sql-generator/types";

import { UpdateValidationCopyButtons } from "./update-validation-copy-buttons";

type SqlPreviewPanelProps = {
  sql: string | null;
  previewSql?: string | null;
  message?: string;
  valueCount: number;
  operation: SqlOperation;
  table?: string;
  whereColumn?: string;
  generationMeta?: SqlGenerationMeta;
  updateMeta?: {
    recordCount: number;
    generationType: UpdateGenerationType;
    statementCount: number;
  };
  extractionQuality?: DataQualityReport | null;
  validationOptions?: UpdateValidationOptions;
  validationBlocks?: UpdateValidationBlocks | null;
};

type ValidationBlockKey = keyof UpdateValidationBlocks;

const validationBlockLabels: Record<ValidationBlockKey, string> = {
  preSelect: "SELECT previo",
  update: "UPDATE",
  postSelect: "SELECT posterior",
};

function formatGenerationLabel(label: string): string {
  if (label === "UPDATE masivo (WHERE IN)") {
    return "WHERE IN";
  }
  return label;
}

function GenerationSummary({
  operation,
  valueCount,
  generationMeta,
  updateMeta,
}: {
  operation: SqlOperation;
  valueCount: number;
  generationMeta?: SqlGenerationMeta;
  updateMeta?: SqlPreviewPanelProps["updateMeta"];
}) {
  if (generationMeta) {
    return (
      <div className="overflow-x-auto">
        <p className="inline-flex items-center gap-x-2 whitespace-nowrap text-xs text-muted">
          <span className="whitespace-nowrap font-medium text-foreground">
            {generationMeta.recordCount} registros
          </span>
          <span aria-hidden="true">•</span>
          <span className="whitespace-nowrap">
            {formatGenerationLabel(generationMeta.generationLabel)}
          </span>
          <span aria-hidden="true">•</span>
          <span className="whitespace-nowrap">{generationMeta.durationMs} ms</span>
          {generationMeta.isPreviewTruncated && (
            <>
              <span aria-hidden="true">•</span>
              <span className="whitespace-nowrap text-amber-400/90">
                Preview limitado
              </span>
            </>
          )}
        </p>
      </div>
    );
  }

  if (operation === "UPDATE" && updateMeta) {
    return (
      <div className="overflow-x-auto">
        <p className="whitespace-nowrap text-xs text-muted">
          {updateMeta.recordCount} registros ·{" "}
          {updateMeta.generationType === "bulk" ? "WHERE IN" : "UPDATE individual"}
        </p>
      </div>
    );
  }

  if (operation === "UPDATE") {
    return (
      <div className="overflow-x-auto">
        <p className="whitespace-nowrap text-xs text-muted">
          {valueCount > 0
            ? `${valueCount} registros WHERE`
            : "Sin valores WHERE aún"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <p className="whitespace-nowrap text-xs text-muted">
        {valueCount > 0
          ? `${valueCount} valores en la cláusula IN`
          : "Sin valores aún"}
      </p>
    </div>
  );
}

function UpdateWarning({
  sql,
  table,
  whereColumn,
  recordCount,
  duplicateRecords,
}: {
  sql: string | null;
  table?: string;
  whereColumn?: string;
  recordCount: number;
  duplicateRecords: number;
}) {
  const trimmedTable = table?.trim();
  const trimmedWhereColumn = whereColumn?.trim();

  if (!sql) {
    return (
      <p className="mt-0.5 text-muted">
        Revisa el SQL antes de ejecutarlo. Esta acción puede modificar datos de
        forma permanente.
      </p>
    );
  }

  let summary: string;
  if (recordCount > 0 && trimmedTable) {
    summary = `Se generará un script para actualizar ${recordCount} registros en la tabla "${trimmedTable}".`;
  } else if (recordCount > 0) {
    summary = `Se generará un script para actualizar ${recordCount} registros.`;
  } else {
    summary = "Se generará un script UPDATE.";
  }

  return (
    <>
      <p className="mt-0.5 text-muted">{summary}</p>
      <p className="mt-2 text-muted">Antes de ejecutar:</p>
      <ul className="mt-1 list-inside list-disc space-y-0.5 text-muted">
        <li>Revisa el SQL generado.</li>
        {trimmedTable && trimmedWhereColumn && (
          <li>
            Confirma que la tabla y la columna WHERE &quot;{trimmedWhereColumn}
            &quot; sean correctas.
          </li>
        )}
        {trimmedTable && !trimmedWhereColumn && (
          <li>Confirma que la tabla sea correcta.</li>
        )}
        {!trimmedTable && trimmedWhereColumn && (
          <li>
            Confirma que la columna WHERE &quot;{trimmedWhereColumn}&quot; sea
            correcta.
          </li>
        )}
        {duplicateRecords > 0 && (
          <li>
            Si existen registros duplicados, revisa el reporte antes de
            ejecutar.
          </li>
        )}
      </ul>
    </>
  );
}

function PreviewSectionHeader({
  generationMeta,
}: {
  generationMeta: SqlGenerationMeta;
}) {
  const isIndividual = generationMeta.generationLabel === "UPDATE individual";
  const unit = isIndividual ? "sentencias" : "valores";
  const shown =
    generationMeta.previewStatementCount ?? PREVIEW_MAX_IN_LINES;
  const total = generationMeta.recordCount;

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-foreground">Vista previa</p>
      <p className="text-xs text-muted">
        Mostrando los primeros {shown} {unit} de {total}.
      </p>
      <p className="text-xs text-muted">
        El SQL completo está disponible mediante el botón &quot;Copiar SQL&quot;.
      </p>
    </div>
  );
}

const SqlPreviewPanel = React.memo(function SqlPreviewPanel({
  sql,
  previewSql,
  message,
  valueCount,
  operation,
  table,
  whereColumn,
  generationMeta,
  updateMeta,
  extractionQuality,
  validationOptions,
  validationBlocks,
}: SqlPreviewPanelProps) {
  const [selectedValidationBlock, setSelectedValidationBlock] =
    React.useState<ValidationBlockKey>("preSelect");
  const recordCount =
    generationMeta?.recordCount ??
    updateMeta?.recordCount ??
    (operation === "UPDATE" ? valueCount : 0);

  const availableValidationBlocks = React.useMemo(
    () =>
      validationBlocks
        ? (Object.keys(validationBlockLabels) as ValidationBlockKey[]).filter(
            (key) => Boolean(validationBlocks[key]),
          )
        : [],
    [validationBlocks],
  );
  const activeValidationBlock = availableValidationBlocks.includes(
    selectedValidationBlock,
  )
    ? selectedValidationBlock
    : availableValidationBlocks[0];
  const activeValidationSql = activeValidationBlock
    ? validationBlocks?.[activeValidationBlock] ?? null
    : null;
  const activeValidationPreview = React.useMemo(
    () =>
      activeValidationSql
        ? truncateSqlPreview(activeValidationSql).previewSql
        : null,
    [activeValidationSql],
  );
  const isUpdateValidation =
    operation === "UPDATE" && validationOptions !== undefined;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="grid gap-3 space-y-0 pb-4">
        <CardTitle className="text-base">SQL generado</CardTitle>
        <GenerationSummary
          operation={operation}
          valueCount={valueCount}
          generationMeta={generationMeta}
          updateMeta={updateMeta}
        />
        {isUpdateValidation ? (
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {availableValidationBlocks.map((key) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={activeValidationBlock === key ? "default" : "secondary"}
                onClick={() => setSelectedValidationBlock(key)}
              >
                Ver {validationBlockLabels[key]}
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <CopyButton text={sql} />
            {sql && (
              <p className="text-[11px] leading-snug text-muted">
                El botón copia el SQL completo, no solamente el preview.
              </p>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        {operation === "DELETE" && (
          <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <div className="text-sm">
              <p className="font-medium text-amber-200">Operación DELETE</p>
              <p className="mt-0.5 text-muted">
                Borrado físico permanente. Revisa el SQL antes de ejecutarlo.
              </p>
              <p className="mt-1.5 text-muted">
                Para borrado lógico usa UPDATE sobre la columna is_deleted.
              </p>
            </div>
          </div>
        )}
        {operation === "UPDATE" && (
          <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <div className="text-sm">
              <p className="font-medium text-amber-200">Operación UPDATE</p>
              <UpdateWarning
                sql={sql}
                table={table}
                whereColumn={whereColumn}
                recordCount={recordCount}
                duplicateRecords={extractionQuality?.duplicateRecords ?? 0}
              />
            </div>
          </div>
        )}
        {generationMeta?.isPreviewTruncated && (
          <PreviewSectionHeader generationMeta={generationMeta} />
        )}
        <SqlPreview
          sql={isUpdateValidation ? activeValidationSql : sql}
          previewSql={
            isUpdateValidation ? activeValidationPreview : previewSql
          }
          message={message}
          className={
            isUpdateValidation
              ? "min-h-[360px] flex-1 scrollbar-thin lg:min-h-[320px]"
              : undefined
          }
        />
        {isUpdateValidation && validationOptions && (
          <UpdateValidationCopyButtons
            validationOptions={validationOptions}
            validationBlocks={validationBlocks ?? null}
          />
        )}
      </CardContent>
    </Card>
  );
});

export { SqlPreviewPanel };
