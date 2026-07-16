"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CompareMode } from "@/features/compare-studio/types";

const MODE_OPTIONS: { value: CompareMode; label: string }[] = [
  { value: "list", label: "Lista" },
  { value: "text", label: "Texto" },
  { value: "code", label: "Código" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "auto", label: "Automático" },
];

type CompareModeSelectorProps = {
  mode: CompareMode;
  resolvedMode?: CompareMode;
  onModeChange: (mode: CompareMode) => void;
  className?: string;
};

function CompareModeSelector({
  mode,
  resolvedMode,
  onModeChange,
  className,
}: CompareModeSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label>Modo de comparación</Label>
      <div className="flex flex-wrap gap-2">
        {MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onModeChange(option.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              mode === option.value
                ? "border-devkit-primary bg-devkit-primary/10 text-foreground"
                : "border-border bg-card text-muted hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {mode === "auto" && resolvedMode && (
        <p className="text-xs text-muted">
          Modo detectado: <span className="font-medium">{resolvedMode}</span>
        </p>
      )}
    </div>
  );
}

export { CompareModeSelector };
