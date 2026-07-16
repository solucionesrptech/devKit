"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CompareMode, CompareOptions } from "@/features/compare-studio/types";

type CompareOptionsPanelProps = {
  mode: CompareMode;
  resolvedMode: CompareMode;
  options: CompareOptions;
  onChange: (options: CompareOptions) => void;
  className?: string;
};

function OptionCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="h-4 w-4 rounded border-border"
      />
      {label}
    </label>
  );
}

function CompareOptionsPanel({
  mode,
  resolvedMode,
  options,
  onChange,
  className,
}: CompareOptionsPanelProps) {
  const effectiveMode = mode === "auto" ? resolvedMode : mode;
  const showSqlOptions = effectiveMode === "sql";
  const showTextOptions = effectiveMode === "text";

  return (
    <div className={cn("space-y-3", className)}>
      <Label>Opciones</Label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <OptionCheckbox
          id="ignore-whitespace"
          label="Ignorar espacios"
          checked={options.ignoreWhitespace}
          onCheckedChange={(checked) =>
            onChange({ ...options, ignoreWhitespace: checked })
          }
        />
        {showTextOptions && (
          <OptionCheckbox
            id="ignore-line-breaks"
            label="Ignorar saltos de línea"
            checked={options.ignoreLineBreaks}
            onCheckedChange={(checked) =>
              onChange({ ...options, ignoreLineBreaks: checked })
            }
          />
        )}
        <OptionCheckbox
          id="ignore-empty-lines"
          label="Ignorar líneas vacías"
          checked={options.ignoreEmptyLines}
          onCheckedChange={(checked) =>
            onChange({ ...options, ignoreEmptyLines: checked })
          }
        />
        <OptionCheckbox
          id="ignore-case"
          label="Ignorar mayúsculas"
          checked={options.ignoreCase}
          onCheckedChange={(checked) =>
            onChange({ ...options, ignoreCase: checked })
          }
        />
        {showSqlOptions && (
          <>
            <OptionCheckbox
              id="format-before-compare"
              label="Formatear antes de comparar"
              checked={options.formatBeforeCompare}
              onCheckedChange={(checked) =>
                onChange({ ...options, formatBeforeCompare: checked })
              }
            />
            <OptionCheckbox
              id="ignore-sql-comments"
              label="Ignorar comentarios SQL"
              checked={options.ignoreSqlComments}
              onCheckedChange={(checked) =>
                onChange({ ...options, ignoreSqlComments: checked })
              }
            />
          </>
        )}
      </div>
      {effectiveMode === "json" && (
        <p className="text-xs text-muted">
          JSON se formatea automáticamente y se valida la sintaxis.
        </p>
      )}
    </div>
  );
}

export { CompareOptionsPanel };
