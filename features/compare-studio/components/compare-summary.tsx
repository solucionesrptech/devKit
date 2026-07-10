"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { CompareResult } from "@/features/compare-studio/types";
import { cn } from "@/lib/utils";

type CompareSummaryProps = {
  result: CompareResult | null;
  className?: string;
};

function CompareSummaryPanel({ result, className }: CompareSummaryProps) {
  if (!result) {
    return (
      <Card className={cn(className)}>
        <CardContent className="py-6 text-sm text-muted">
          Pega o sube contenido en ambos lados para comparar.
        </CardContent>
      </Card>
    );
  }

  if (result.summary.isEqual) {
    return (
      <Card className={cn(className)}>
        <CardContent className="space-y-1 py-6">
          <p className="text-sm font-medium text-foreground">
            Comparación completada
          </p>
          <p className="text-sm text-muted">Archivos iguales.</p>
        </CardContent>
      </Card>
    );
  }

  if (result.kind === "list") {
    return (
      <Card className={cn(className)}>
        <CardContent className="space-y-2 py-6">
          <p className="text-sm font-medium text-foreground">
            Comparación completada
          </p>
          <p className="text-sm text-muted">
            {result.summary.totalDifferences} diferencias encontradas
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <span>Coincidencias: {result.counts.matches}</span>
            <span>Solo izquierda: {result.counts.onlyLeft}</span>
            <span>Solo derecha: {result.counts.onlyRight}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardContent className="space-y-2 py-6">
        <p className="text-sm font-medium text-foreground">
          Comparación completada
        </p>
        <p className="text-sm text-muted">
          {result.summary.totalDifferences} diferencias encontradas
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <span>{result.summary.added} líneas agregadas</span>
          <span>{result.summary.removed} eliminadas</span>
          <span>{result.summary.modified} modificadas</span>
          <span>{result.summary.unchanged} sin cambios</span>
        </div>
      </CardContent>
    </Card>
  );
}

export { CompareSummaryPanel };
