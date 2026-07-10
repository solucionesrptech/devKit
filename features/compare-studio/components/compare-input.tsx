"use client";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CompareSourceKind } from "@/features/compare-studio/types";
import { cn } from "@/lib/utils";

import { CompareFileDropzone } from "./compare-file-dropzone";

type CompareInputProps = {
  sideLabel: string;
  sourceKind: CompareSourceKind;
  text: string;
  fileName?: string;
  onSourceKindChange: (kind: CompareSourceKind) => void;
  onTextChange: (value: string) => void;
  onFileSelect: (file: File) => void;
  className?: string;
};

function CompareInput({
  sideLabel,
  sourceKind,
  text,
  fileName,
  onSourceKindChange,
  onTextChange,
  onFileSelect,
  className,
}: CompareInputProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label>{sideLabel}</Label>
      <Tabs
        value={sourceKind}
        onValueChange={(value) => onSourceKindChange(value as CompareSourceKind)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="paste" className="flex-1">
            Pegar texto
          </TabsTrigger>
          <TabsTrigger value="file" className="flex-1">
            Subir archivo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-3">
          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) onFileSelect(file);
            }}
            placeholder={`Contenido de ${sideLabel}`}
            className="flex min-h-[280px] w-full resize-y rounded-lg border border-border bg-input px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </TabsContent>

        <TabsContent value="file" className="mt-3">
          <CompareFileDropzone onFileSelect={onFileSelect} fileName={fileName} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { CompareInput };
