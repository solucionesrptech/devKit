"use client";

import { DiffEditor, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import * as React from "react";

import {
  defineDevKitMonacoThemes,
  getMonacoLanguage,
  getDevKitMonacoTheme,
} from "@/features/compare-studio/lib/monaco-language";
import type { CompareMode } from "@/features/compare-studio/types";

import { CompareMinimap } from "./compare-minimap";
import { CompareNavigation } from "./compare-navigation";

type CompareDiffViewProps = {
  original: string;
  modified: string;
  mode: CompareMode;
  leftFileName?: string;
  rightFileName?: string;
  ignoreWhitespace: boolean;
};

function CompareDiffView({
  original,
  modified,
  mode,
  leftFileName,
  rightFileName,
  ignoreWhitespace,
}: CompareDiffViewProps) {
  const diffEditorRef =
    React.useRef<editor.IStandaloneDiffEditor | null>(null);
  const [lineChanges, setLineChanges] = React.useState<editor.ILineChange[]>(
    [],
  );
  const [activeDiffIndex, setActiveDiffIndex] = React.useState(0);
  const [theme, setTheme] = React.useState(getDevKitMonacoTheme());

  const language = getMonacoLanguage(
    mode,
    leftFileName,
    rightFileName,
    original,
    modified,
  );
  const totalLines = Math.max(
    original.split("\n").length,
    modified.split("\n").length,
    1,
  );

  React.useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setTheme(getDevKitMonacoTheme());
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const refreshChanges = React.useCallback(
    (editorInstance: editor.IStandaloneDiffEditor) => {
      const changes = editorInstance.getLineChanges() ?? [];
      setLineChanges(changes);
      if (activeDiffIndex >= changes.length) {
        setActiveDiffIndex(0);
      }
    },
    [activeDiffIndex],
  );

  const handleMount = (editorInstance: editor.IStandaloneDiffEditor) => {
    diffEditorRef.current = editorInstance;
    refreshChanges(editorInstance);
    editorInstance.onDidUpdateDiff(() => refreshChanges(editorInstance));
  };

  const handleBeforeMount = (monaco: Monaco) => {
    defineDevKitMonacoThemes(monaco);
  };

  const jumpToDiff = (index: number) => {
    const editorInstance = diffEditorRef.current;
    const changes = editorInstance?.getLineChanges() ?? lineChanges;
    if (!editorInstance || changes.length === 0) return;

    const safeIndex = ((index % changes.length) + changes.length) % changes.length;
    setActiveDiffIndex(safeIndex);

    const change = changes[safeIndex];
    const line =
      change.modifiedStartLineNumber ??
      change.originalStartLineNumber ??
      1;

    editorInstance.revealLineInCenter(line);
    editorInstance.getModifiedEditor().setPosition({
      lineNumber: line,
      column: 1,
    });
    editorInstance.getModifiedEditor().focus();
  };

  const goToNext = () => jumpToDiff(activeDiffIndex + 1);
  const goToPrevious = () => jumpToDiff(activeDiffIndex - 1);

  return (
    <div className="space-y-3">
      <CompareNavigation
        currentIndex={activeDiffIndex}
        total={lineChanges.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />

      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-500/70" />
          Línea agregada
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500/70" />
          Línea eliminada
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400/80" />
          Línea modificada
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-muted/40" />
          Sin cambios
        </span>
        {mode === "code" && (
          <span className="ml-auto rounded-md border border-border px-2 py-0.5 font-medium text-foreground">
            Lenguaje: {language}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 px-2 text-xs font-medium text-muted">
        <span className="truncate">
          Original · izquierda{leftFileName ? ` · ${leftFileName}` : ""}
        </span>
        <span className="truncate">
          Nueva versión · derecha{rightFileName ? ` · ${rightFileName}` : ""}
        </span>
      </div>

      <div className="flex gap-2 overflow-hidden rounded-lg border border-border">
        <div className="min-h-[600px] min-w-0 flex-1">
          <DiffEditor
            height="clamp(600px, 78vh, 900px)"
            language={language}
            original={original}
            modified={modified}
            theme={theme}
            beforeMount={handleBeforeMount}
            onMount={handleMount}
            options={{
              readOnly: true,
              renderSideBySide: true,
              ignoreTrimWhitespace: ignoreWhitespace,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "off",
              diffWordWrap: "off",
              wordWrapOverride1: "off",
              wordWrapOverride2: "off",
              lineNumbers: "on",
              renderIndicators: true,
              renderMarginRevertIcon: false,
              renderOverviewRuler: false,
              scrollbar: {
                horizontal: "auto",
                alwaysConsumeMouseWheel: false,
              },
              useInlineViewWhenSpaceIsLimited: true,
              automaticLayout: true,
            }}
          />
        </div>
        <div className="hidden shrink-0 py-2 pr-2 sm:block">
          <CompareMinimap
            changes={lineChanges}
            totalLines={totalLines}
            activeIndex={activeDiffIndex}
            onJump={jumpToDiff}
          />
        </div>
      </div>
    </div>
  );
}

export { CompareDiffView };
