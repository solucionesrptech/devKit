/**
 * SELECT y DELETE comparten formulario (columna WHERE + IN).
 * UPDATE usa formulario propio (ver ARCHITECTURE.md).
 */
export type SqlOperation = "SELECT" | "DELETE" | "UPDATE";

export type SqlDialect = "sqlserver" | "postgresql";

export type ValueDataType = "number" | "text";

export type UpdateAssignmentDataType = ValueDataType | "null";

export type UpdateAssignment = {
  column: string;
  value: string;
  dataType: UpdateAssignmentDataType;
};

export type UpdateGenerationMode = "auto" | "per-row";

export type UpdateGenerationType = "bulk" | "individual";

export type UpdateValidationOptions = {
  includePreSelect: boolean;
  includeUpdate: boolean;
  includePostSelect: boolean;
};

export const DEFAULT_UPDATE_VALIDATION_OPTIONS: UpdateValidationOptions = {
  includePreSelect: true,
  includeUpdate: true,
  includePostSelect: false,
};

export type UpdateValidationBlocks = {
  preSelect: string | null;
  update: string | null;
  postSelect: string | null;
};

/**
 * Entrada para SELECT/DELETE (cláusula IN).
 */
export type SqlGeneratorInput = {
  operation: Exclude<SqlOperation, "UPDATE">;
  dialect: SqlDialect;
  table: string;
  whereColumn: string;
  dataType: ValueDataType;
  values: string[];
};

export type SqlUpdateInput = {
  dialect: SqlDialect;
  table: string;
  whereColumn: string;
  whereDataType: ValueDataType;
  whereValues: string[];
  assignments: UpdateAssignment[];
  generationMode: UpdateGenerationMode;
  validationOptions?: UpdateValidationOptions;
};

export type SqlGenerationMeta = {
  recordCount: number;
  statementCount: number;
  generationLabel: string;
  durationMs: number;
  isPreviewTruncated: boolean;
  previewStatementCount?: number;
};

export type SqlGeneratorResult = {
  sql: string | null;
  previewSql?: string | null;
  message?: string;
  generationMeta?: SqlGenerationMeta;
  updateMeta?: {
    recordCount: number;
    generationType: UpdateGenerationType;
    statementCount: number;
  };
  validationBlocks?: UpdateValidationBlocks | null;
};

export type SpreadsheetColumn = {
  index: number;
  name: string;
};

export type ParsedSpreadsheet = {
  columns: SpreadsheetColumn[];
  rows: string[][];
};
