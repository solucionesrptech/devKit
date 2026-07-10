"use client";

import { ArrowLeftRight, Eraser, GitCompare } from "lucide-react";

import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";

type CompareToolbarProps = {
  onCompare: () => void;
  onSwap: () => void;
  onClear: () => void;
  copyText: string | null;
  isComparing?: boolean;
};

function CompareToolbar({
  onCompare,
  onSwap,
  onClear,
  copyText,
  isComparing = false,
}: CompareToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" onClick={onCompare} disabled={isComparing}>
        <GitCompare className="h-4 w-4" />
        Comparar
      </Button>
      <Button type="button" variant="outline" onClick={onSwap}>
        <ArrowLeftRight className="h-4 w-4" />
        Intercambiar lados
      </Button>
      <Button type="button" variant="outline" onClick={onClear}>
        <Eraser className="h-4 w-4" />
        Limpiar
      </Button>
      <CopyButton
        text={copyText}
        label="Copiar resultado"
        successMessage="Resultado copiado al portapapeles"
        className="ml-auto"
      />
    </div>
  );
}

export { CompareToolbar };
