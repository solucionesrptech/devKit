import * as React from "react";

import { cn } from "@/lib/utils";

type PasteZoneProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  valueCount?: number;
  className?: string;
  id?: string;
};

function PasteZone({
  value,
  onChange,
  placeholder = "Pega una lista de valores, uno por línea…",
  valueCount,
  className,
  id,
}: PasteZoneProps) {
  const lineCount = value ? value.split("\n").length : 0;

  return (
    <div className={cn("space-y-2", className)}>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className="flex min-h-[200px] w-full resize-y rounded-lg border border-border bg-input px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{lineCount} líneas</span>
        {valueCount !== undefined && (
          <span>{valueCount} registros válidos</span>
        )}
      </div>
    </div>
  );
}

export { PasteZone };
