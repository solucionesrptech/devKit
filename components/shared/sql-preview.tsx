import * as React from "react";

import { cn } from "@/lib/utils";

type SqlPreviewProps = {
  sql: string | null;
  previewSql?: string | null;
  message?: string;
  className?: string;
};

function SqlPreview({ sql, previewSql, message, className }: SqlPreviewProps) {
  const displaySql = previewSql ?? sql;
  const isEmpty = !displaySql;

  return (
    <div
      className={cn(
        "min-h-[280px] overflow-auto rounded-lg border border-border bg-[#0a0c10] p-4",
        className,
      )}
    >
      {isEmpty ? (
        <p className="text-sm text-neutral-400">
          {message ?? "El SQL aparecerá aquí."}
        </p>
      ) : (
        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-white">
          {displaySql}
        </pre>
      )}
    </div>
  );
}

export { SqlPreview };
