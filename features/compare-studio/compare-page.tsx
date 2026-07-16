"use client";

import dynamic from "next/dynamic";
import { Pencil } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CompareEditor } from "@/features/compare-studio/components/compare-editor";
import { CompareListView } from "@/features/compare-studio/components/compare-list-view";
import { CompareModeSelector } from "@/features/compare-studio/components/compare-mode-selector";
import { CompareOptionsPanel } from "@/features/compare-studio/components/compare-options";
import { CompareSummaryPanel } from "@/features/compare-studio/components/compare-summary";
import { CompareToolbar } from "@/features/compare-studio/components/compare-toolbar";
import { getCompareResultCopyText } from "@/features/compare-studio/lib/compare-export";
import { readCompareFile } from "@/features/compare-studio/lib/compare-files";
import {
  getResolvedMode,
  runCompare,
} from "@/features/compare-studio/lib/compare-text";
import { getDiffTexts } from "@/features/compare-studio/lib/prepare-display";
import {
  DEFAULT_COMPARE_OPTIONS,
  type CompareMode,
  type CompareOptions,
  type CompareSourceKind,
} from "@/features/compare-studio/types";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";

const CompareDiffView = dynamic(
  () =>
    import("@/features/compare-studio/components/compare-diff-view").then(
      (module) => module.CompareDiffView,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[600px] items-center justify-center rounded-lg border border-border text-sm text-muted">
        Cargando comparador visual…
      </div>
    ),
  },
);

function getDebounceMs(left: string, right: string): number {
  const lineCount = Math.max(
    left.split("\n").length,
    right.split("\n").length,
  );
  return lineCount > 5000 ? 800 : 300;
}

function ComparePage() {
  const [workspaceView, setWorkspaceView] = React.useState<"edit" | "diff">(
    "edit",
  );
  const [mode, setMode] = React.useState<CompareMode>("auto");
  const [options, setOptions] =
    React.useState<CompareOptions>(DEFAULT_COMPARE_OPTIONS);

  const [leftSourceKind, setLeftSourceKind] =
    React.useState<CompareSourceKind>("paste");
  const [rightSourceKind, setRightSourceKind] =
    React.useState<CompareSourceKind>("paste");

  const [leftText, setLeftText] = React.useState("");
  const [rightText, setRightText] = React.useState("");
  const [leftFileName, setLeftFileName] = React.useState<string>();
  const [rightFileName, setRightFileName] = React.useState<string>();

  const debounceMs = React.useMemo(
    () => getDebounceMs(leftText, rightText),
    [leftText, rightText],
  );

  const debouncedLeft = useDebouncedValue(leftText, debounceMs);
  const debouncedRight = useDebouncedValue(rightText, debounceMs);

  const resolvedMode = React.useMemo(
    () => getResolvedMode(mode, debouncedLeft, debouncedRight),
    [mode, debouncedLeft, debouncedRight],
  );

  const result = React.useMemo(
    () => runCompare(debouncedLeft, debouncedRight, mode, options),
    [debouncedLeft, debouncedRight, mode, options],
  );

  const diffTexts = React.useMemo(() => {
    if (resolvedMode === "list") return null;
    return getDiffTexts(debouncedLeft, debouncedRight, resolvedMode, options);
  }, [debouncedLeft, debouncedRight, resolvedMode, options]);

  const copyText = React.useMemo(
    () => getCompareResultCopyText(result),
    [result],
  );

  const handleCompare = () => {
    if (!leftText.trim() && !rightText.trim()) {
      toast.message("Agrega contenido en al menos un lado.");
      return;
    }

    setWorkspaceView("diff");
  };

  const handleSwap = () => {
    setLeftText(rightText);
    setRightText(leftText);
    setLeftFileName(rightFileName);
    setRightFileName(leftFileName);
    setLeftSourceKind(rightSourceKind);
    setRightSourceKind(leftSourceKind);
  };

  const handleClear = () => {
    setLeftText("");
    setRightText("");
    setLeftFileName(undefined);
    setRightFileName(undefined);
    setWorkspaceView("edit");
  };

  const handleLeftFileSelect = async (file: File) => {
    try {
      const content = await readCompareFile(file);
      setLeftText(content);
      setLeftFileName(file.name);
      setLeftSourceKind("file");
    } catch {
      toast.error("No pudimos leer el archivo izquierdo.");
    }
  };

  const handleRightFileSelect = async (file: File) => {
    try {
      const content = await readCompareFile(file);
      setRightText(content);
      setRightFileName(file.name);
      setRightSourceKind("file");
    } catch {
      toast.error("No pudimos leer el archivo derecho.");
    }
  };

  return (
    <div className="space-y-6">
      <CompareModeSelector
        mode={mode}
        resolvedMode={resolvedMode}
        onModeChange={setMode}
      />

      {workspaceView === "edit" ? (
        <CompareEditor
          leftSourceKind={leftSourceKind}
          rightSourceKind={rightSourceKind}
          leftText={leftText}
          rightText={rightText}
          leftFileName={leftFileName}
          rightFileName={rightFileName}
          onLeftSourceKindChange={setLeftSourceKind}
          onRightSourceKindChange={setRightSourceKind}
          onLeftTextChange={setLeftText}
          onRightTextChange={setRightText}
          onLeftFileSelect={handleLeftFileSelect}
          onRightFileSelect={handleRightFileSelect}
        />
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label>Comparación</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWorkspaceView("edit")}
            >
              <Pencil className="h-4 w-4" />
              Editar contenido
            </Button>
          </div>

          <CompareSummaryPanel result={result} />

          {result?.kind === "list" && <CompareListView result={result} />}

          {result && result.kind !== "list" && diffTexts && (
            <>
              {result.kind === "json" &&
                (!result.isValidLeft || !result.isValidRight) && (
                  <div className="space-y-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-muted">
                    {!result.isValidLeft && (
                      <p>JSON izquierdo inválido: {result.parseErrorLeft}</p>
                    )}
                    {!result.isValidRight && (
                      <p>JSON derecho inválido: {result.parseErrorRight}</p>
                    )}
                  </div>
                )}
              {result.kind === "json" &&
                (result.addedKeys.length > 0 ||
                  result.removedKeys.length > 0) && (
                  <div className="rounded-lg border border-border p-4 text-sm text-muted">
                    {result.removedKeys.length > 0 && (
                      <p>
                        Propiedades eliminadas: {result.removedKeys.join(", ")}
                      </p>
                    )}
                    {result.addedKeys.length > 0 && (
                      <p>
                        Propiedades agregadas: {result.addedKeys.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              <CompareDiffView
                original={diffTexts.original}
                modified={diffTexts.modified}
                mode={resolvedMode}
                leftFileName={leftFileName}
                rightFileName={rightFileName}
                ignoreWhitespace={options.ignoreWhitespace}
              />
            </>
          )}
        </section>
      )}

      <CompareOptionsPanel
        mode={mode}
        resolvedMode={resolvedMode}
        options={options}
        onChange={setOptions}
      />

      <CompareToolbar
        onCompare={handleCompare}
        onSwap={handleSwap}
        onClear={handleClear}
        copyText={copyText}
        showCompare={workspaceView === "edit"}
      />

    </div>
  );
}

export { ComparePage };
