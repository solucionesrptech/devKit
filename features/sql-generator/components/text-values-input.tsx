"use client";

import { PasteZone } from "@/components/shared/paste-zone";

type TextValuesInputProps = {
  value: string;
  onChange: (value: string) => void;
  valueCount: number;
};

function TextValuesInput({ value, onChange, valueCount }: TextValuesInputProps) {
  return (
    <PasteZone
      id="sql-values-text"
      value={value}
      onChange={onChange}
      valueCount={valueCount}
      placeholder={`101\n102\n103\n\no\n\nuser-001\nuser-002`}
    />
  );
}

export { TextValuesInput };
