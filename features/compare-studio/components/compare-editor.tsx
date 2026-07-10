"use client";

import type { CompareSourceKind } from "@/features/compare-studio/types";

import { CompareInput } from "./compare-input";

type CompareEditorProps = {
  leftSourceKind: CompareSourceKind;
  rightSourceKind: CompareSourceKind;
  leftText: string;
  rightText: string;
  leftFileName?: string;
  rightFileName?: string;
  onLeftSourceKindChange: (kind: CompareSourceKind) => void;
  onRightSourceKindChange: (kind: CompareSourceKind) => void;
  onLeftTextChange: (value: string) => void;
  onRightTextChange: (value: string) => void;
  onLeftFileSelect: (file: File) => void;
  onRightFileSelect: (file: File) => void;
};

function CompareEditor({
  leftSourceKind,
  rightSourceKind,
  leftText,
  rightText,
  leftFileName,
  rightFileName,
  onLeftSourceKindChange,
  onRightSourceKindChange,
  onLeftTextChange,
  onRightTextChange,
  onLeftFileSelect,
  onRightFileSelect,
}: CompareEditorProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <CompareInput
        sideLabel="Origen izquierdo"
        sourceKind={leftSourceKind}
        text={leftText}
        fileName={leftFileName}
        onSourceKindChange={onLeftSourceKindChange}
        onTextChange={onLeftTextChange}
        onFileSelect={onLeftFileSelect}
      />
      <CompareInput
        sideLabel="Origen derecho"
        sourceKind={rightSourceKind}
        text={rightText}
        fileName={rightFileName}
        onSourceKindChange={onRightSourceKindChange}
        onTextChange={onRightTextChange}
        onFileSelect={onRightFileSelect}
      />
    </div>
  );
}

export { CompareEditor };
