"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ASSIGNMENT_DATA_TYPE_LABELS,
  type UpdateAssignmentRow,
} from "@/features/sql-generator/lib/update-assignment-rows";
import type { UpdateAssignmentDataType } from "@/features/sql-generator/types";

type UpdateAssignmentsTableProps = {
  rows: UpdateAssignmentRow[];
  presetColumns?: string[];
  isCustomTable: boolean;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onRowChange: (
    id: string,
    patch: Partial<Pick<UpdateAssignmentRow, "column" | "value" | "dataType">>,
  ) => void;
};

function UpdateAssignmentsTable({
  rows,
  presetColumns = [],
  isCustomTable,
  onAddRow,
  onRemoveRow,
  onRowChange,
}: UpdateAssignmentsTableProps) {
  return (
    <div className="space-y-3">
      <Label>SET</Label>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-3 py-2 text-left font-medium text-muted">
                Columna
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted">
                Valor
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted">
                Tipo
              </th>
              <th className="w-12 px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isNullType = row.dataType === "null";

              return (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 align-top">
                    {isCustomTable ? (
                      <Input
                        value={row.column}
                        onChange={(e) =>
                          onRowChange(row.id, { column: e.target.value })
                        }
                        placeholder="bloqueado"
                        aria-label="Columna SET"
                      />
                    ) : (
                      <Select
                        value={row.column || undefined}
                        onValueChange={(value) =>
                          onRowChange(row.id, { column: value })
                        }
                      >
                        <SelectTrigger aria-label="Columna SET">
                          <SelectValue placeholder="Columna" />
                        </SelectTrigger>
                        <SelectContent>
                          {presetColumns.map((column) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <Input
                      value={isNullType ? "NULL" : row.value}
                      onChange={(e) =>
                        onRowChange(row.id, { value: e.target.value })
                      }
                      placeholder="0"
                      disabled={isNullType}
                      aria-label="Valor SET"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <Select
                      value={row.dataType}
                      onValueChange={(value) =>
                        onRowChange(row.id, {
                          dataType: value as UpdateAssignmentDataType,
                        })
                      }
                    >
                      <SelectTrigger aria-label="Tipo de dato SET">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="number">
                          {ASSIGNMENT_DATA_TYPE_LABELS.number}
                        </SelectItem>
                        <SelectItem value="text">
                          {ASSIGNMENT_DATA_TYPE_LABELS.text}
                        </SelectItem>
                        <SelectItem value="null">
                          {ASSIGNMENT_DATA_TYPE_LABELS.null}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveRow(row.id)}
                      disabled={rows.length <= 1}
                      aria-label="Eliminar columna"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={onAddRow}>
        <Plus className="h-4 w-4" />
        Agregar columna
      </Button>
    </div>
  );
}

export { UpdateAssignmentsTable };
