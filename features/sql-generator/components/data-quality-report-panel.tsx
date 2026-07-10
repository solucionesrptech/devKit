"use client";

import { Download, List } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import type {
  DataQualityReport,
  DuplicateEntry,
} from "@/features/sql-generator/lib/extract-values";
import { downloadDuplicatesCsv } from "@/features/sql-generator/lib/export-duplicates-csv";

import { DuplicatesDetailDialog } from "./duplicates-detail-dialog";

type DataQualityReportPanelProps = {
  quality: DataQualityReport | null;
  duplicates: DuplicateEntry[];
  removeDuplicates: boolean;
  omittedDuplicates?: number;
  sqlGeneratedCount?: number;
};

type StatCardProps = {
  label: string;
  value: number | string;
  className?: string;
};

function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-background/40 px-3 py-2.5 ${className ?? ""}`}
    >
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function DataQualityReportPanel({
  quality,
  duplicates,
  removeDuplicates,
  omittedDuplicates = 0,
  sqlGeneratedCount,
}: DataQualityReportPanelProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  if (!quality) return null;

  const hasDuplicates = quality.duplicateRecords > 0;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/20 px-3 py-3">
      <p className="text-xs font-medium text-foreground">Calidad de datos</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Filas detectadas" value={quality.rowsDetected} />
        <StatCard label="Registros válidos" value={quality.validRecords} />
        <StatCard label="Valores únicos" value={quality.uniqueValues} />
        <StatCard label="Duplicados" value={quality.duplicateRecords} />
        <StatCard label="Filas vacías" value={quality.emptyRows} />
        {quality.omittedByLimit > 0 && (
          <StatCard
            label="Omitidos por límite"
            value={quality.omittedByLimit}
          />
        )}
        {removeDuplicates && (
          <StatCard label="Duplicados omitidos" value={omittedDuplicates} />
        )}
        {sqlGeneratedCount !== undefined && (
          <StatCard
            label="SQL generado"
            value={`${sqlGeneratedCount} registros`}
            className="sm:col-span-2"
          />
        )}
      </div>

      {hasDuplicates && (
        <p className="text-xs text-muted">
          Puedes revisar el detalle, corregir el archivo o continuar con la
          generación del SQL.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!hasDuplicates}
          onClick={() => setDialogOpen(true)}
        >
          <List className="h-3.5 w-3.5" />
          Ver duplicados
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!hasDuplicates}
          onClick={() => downloadDuplicatesCsv(duplicates)}
        >
          <Download className="h-3.5 w-3.5" />
          Descargar duplicados (.csv)
        </Button>
      </div>

      <DuplicatesDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        duplicates={duplicates}
      />
    </div>
  );
}

export { DataQualityReportPanel };
