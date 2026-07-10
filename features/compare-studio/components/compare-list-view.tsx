"use client";

import type { ListCompareResult } from "@/features/compare-studio/types";

type CompareListViewProps = {
  result: ListCompareResult;
};

function ListColumn({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <pre className="min-h-[200px] overflow-auto rounded-lg border border-border bg-[#0a0c10] p-3 font-mono text-sm text-white">
        {values.length > 0 ? values.join("\n") : "—"}
      </pre>
    </div>
  );
}

function CompareListView({ result }: CompareListViewProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ListColumn
        title={`Coinciden (${result.counts.matches})`}
        values={result.matches}
      />
      <ListColumn
        title={`Solo izquierda (${result.counts.onlyLeft})`}
        values={result.onlyLeft}
      />
      <ListColumn
        title={`Solo derecha (${result.counts.onlyRight})`}
        values={result.onlyRight}
      />
    </div>
  );
}

export { CompareListView };
