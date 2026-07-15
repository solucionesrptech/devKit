"use client";

import type { editor } from "monaco-editor";

type CompareMinimapProps = {
  changes: editor.ILineChange[];
  totalLines: number;
  activeIndex: number;
  onJump: (index: number) => void;
};

function CompareMinimap({
  changes,
  totalLines,
  activeIndex,
  onJump,
}: CompareMinimapProps) {
  if (changes.length === 0 || totalLines === 0) {
    return (
      <div
        className="h-full min-h-[320px] w-4 rounded-full bg-muted/20"
        aria-hidden
      />
    );
  }

  const safeTotal = Math.max(totalLines, 1);

  return (
    <div className="relative h-full min-h-[320px] w-4 rounded-full bg-muted/20">
      <svg
        viewBox={`0 0 1 ${safeTotal}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full rounded-full"
        role="img"
        aria-label="Mapa de diferencias"
      >
        {changes.map((change, index) => {
          const line =
            change.modifiedStartLineNumber ??
            change.originalStartLineNumber ??
            1;
          const height = Math.max(
            (change.modifiedEndLineNumber ?? line) -
              (change.modifiedStartLineNumber ?? line) +
              1,
            1,
          );
          const isActive = index === activeIndex;

          return (
            <rect
              key={`${line}-${index}`}
              x="0"
              y={Math.max(line - 1, 0)}
              width="1"
              height={height}
              className={
                isActive
                  ? "cursor-pointer fill-amber-400"
                  : "cursor-pointer fill-devkit-primary/80 hover:fill-devkit-primary"
              }
              onClick={() => onJump(index)}
            />
          );
        })}
      </svg>
    </div>
  );
}

export { CompareMinimap };
