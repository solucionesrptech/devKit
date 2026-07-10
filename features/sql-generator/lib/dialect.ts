import type { SqlDialect, SqlGeneratorInput, SqlOperation } from "../types";

/**
 * Punto de extensión para diferencias de dialecto.
 * En MVP retorna el SQL base sin modificaciones.
 */
export function resolveStatement(
  _input: Pick<SqlGeneratorInput, "operation" | "dialect"> | {
    operation: Extract<SqlOperation, "UPDATE">;
    dialect: SqlDialect;
  },
  baseSql: string,
): string {
  return baseSql;
}

export const DIALECT_LABELS: Record<SqlDialect, string> = {
  sqlserver: "SQL Server",
  postgresql: "PostgreSQL",
};
