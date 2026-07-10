"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type CompareNavigationProps = {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
};

function CompareNavigation({
  currentIndex,
  total,
  onPrevious,
  onNext,
}: CompareNavigationProps) {
  const label =
    total === 0
      ? "Sin diferencias"
      : `${Math.min(currentIndex + 1, total)} / ${total} diferencias`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={total === 0}
      >
        <ChevronLeft className="h-4 w-4" />
        Diferencia anterior
      </Button>
      <span className="text-sm text-muted">{label}</span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={total === 0}
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export { CompareNavigation };
