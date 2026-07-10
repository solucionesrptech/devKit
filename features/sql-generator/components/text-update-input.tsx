"use client";

import { PasteZone } from "@/components/shared/paste-zone";

type TextUpdateInputProps = {
  value: string;
  onChange: (value: string) => void;
  valueCount: number;
};

function TextUpdateInput({ value, onChange, valueCount }: TextUpdateInputProps) {
  return (
    <div className="space-y-2">
      <PasteZone
        id="sql-update-where-text"
        value={value}
        onChange={onChange}
        placeholder={`14475488-3\n11111111-1\n22222222-2\n\nUn valor WHERE por línea`}
      />
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Valores para la columna WHERE, uno por línea</span>
        <span>{valueCount} valores</span>
      </div>
    </div>
  );
}

export { TextUpdateInput };
