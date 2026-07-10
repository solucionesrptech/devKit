"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIALECT_LABELS } from "@/features/sql-generator/lib/dialect";
import type { SqlDialect, SqlOperation } from "@/features/sql-generator/types";

type SqlOperationFieldsProps = {
  operation: SqlOperation;
  dialect: SqlDialect;
  onOperationChange: (value: SqlOperation) => void;
  onDialectChange: (value: SqlDialect) => void;
};

function SqlOperationFields({
  operation,
  dialect,
  onOperationChange,
  onDialectChange,
}: SqlOperationFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="operation">Operación</Label>
        <Select
          value={operation}
          onValueChange={(v) => onOperationChange(v as SqlOperation)}
        >
          <SelectTrigger id="operation">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SELECT">SELECT</SelectItem>
            <SelectItem value="UPDATE">UPDATE</SelectItem>
            <SelectItem value="DELETE">DELETE (físico)</SelectItem>
          </SelectContent>
        </Select>
        {operation === "DELETE" && (
          <p className="text-xs text-muted">
            Para borrado lógico usa UPDATE sobre la columna Eliminado.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dialect">Motor SQL</Label>
        <Select
          value={dialect}
          onValueChange={(v) => onDialectChange(v as SqlDialect)}
        >
          <SelectTrigger id="dialect">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sqlserver">
              {DIALECT_LABELS.sqlserver}
            </SelectItem>
            <SelectItem value="postgresql">
              {DIALECT_LABELS.postgresql}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export { SqlOperationFields };
