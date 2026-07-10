"use client";

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
  CUSTOM_TABLE_PRESET_ID,
  SQL_TABLE_PRESETS,
  type SqlTablePreset,
} from "@/lib/config/sql-presets";

type SqlTablePresetFieldsProps = {
  tablePresetId: string;
  selectedPreset?: SqlTablePreset;
  table: string;
  whereColumn: string;
  includeWhereColumn?: boolean;
  onTablePresetChange: (presetId: string) => void;
  onTableChange: (value: string) => void;
  onWhereColumnChange: (value: string) => void;
};

function SqlTablePresetFields({
  tablePresetId,
  selectedPreset,
  table,
  whereColumn,
  includeWhereColumn = true,
  onTablePresetChange,
  onTableChange,
  onWhereColumnChange,
}: SqlTablePresetFieldsProps) {
  const isCustomTable = tablePresetId === CUSTOM_TABLE_PRESET_ID;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="table-preset">Tabla frecuente</Label>
        <Select value={tablePresetId} onValueChange={onTablePresetChange}>
          <SelectTrigger id="table-preset">
            <SelectValue placeholder="Selecciona una tabla" />
          </SelectTrigger>
          <SelectContent>
            {SQL_TABLE_PRESETS.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.label}
              </SelectItem>
            ))}
            <SelectItem value={CUSTOM_TABLE_PRESET_ID}>
              Tabla personalizada
            </SelectItem>
          </SelectContent>
        </Select>
        {selectedPreset && (
          <p className="text-xs text-muted">{selectedPreset.description}</p>
        )}
      </div>

      {includeWhereColumn ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="table">Tabla</Label>
            {isCustomTable ? (
              <Input
                id="table"
                value={table}
                onChange={(e) => onTableChange(e.target.value)}
                placeholder="Contratos"
              />
            ) : (
              <Input id="table" value={table} readOnly />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="where-column">Columna WHERE</Label>
            {isCustomTable ? (
              <Input
                id="where-column"
                value={whereColumn}
                onChange={(e) => onWhereColumnChange(e.target.value)}
                placeholder="idDocumento"
              />
            ) : (
              <Select value={whereColumn} onValueChange={onWhereColumnChange}>
                <SelectTrigger id="where-column">
                  <SelectValue placeholder="Selecciona columna" />
                </SelectTrigger>
                <SelectContent>
                  {selectedPreset?.columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="table">Tabla</Label>
          {isCustomTable ? (
            <Input
              id="table"
              value={table}
              onChange={(e) => onTableChange(e.target.value)}
              placeholder="Contratos"
            />
          ) : (
            <Input id="table" value={table} readOnly />
          )}
        </div>
      )}
    </>
  );
}

export { SqlTablePresetFields };
