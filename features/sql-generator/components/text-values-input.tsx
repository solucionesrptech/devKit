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
      placeholder={`2130933\n2130934\n2130935\n\no\n\n11111111-1\n22222222-2`}
    />
  );
}

export { TextValuesInput };
