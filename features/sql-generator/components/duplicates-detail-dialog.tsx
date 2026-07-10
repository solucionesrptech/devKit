"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DuplicateEntry } from "@/features/sql-generator/lib/extract-values";

type DuplicatesDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicates: DuplicateEntry[];
};

function DuplicatesDetailDialog({
  open,
  onOpenChange,
  duplicates,
}: DuplicatesDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registros duplicados</DialogTitle>
          <DialogDescription>
            Valores que aparecen más de una vez en la fuente de datos.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[min(60vh,28rem)] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Filas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {duplicates.map((entry) => (
                <TableRow key={entry.value}>
                  <TableCell className="font-mono text-xs">{entry.value}</TableCell>
                  <TableCell>{entry.count}</TableCell>
                  <TableCell className="text-xs text-muted">
                    {entry.rowNumbers.join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { DuplicatesDetailDialog };
