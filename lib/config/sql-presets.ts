export type SqlTablePreset = {
  id: string;
  label: string;
  description: string;
  table: string;
  defaultKey: string;
  columns: string[];
};

/** Identificador para modo manual sin preset. */
export const CUSTOM_TABLE_PRESET_ID = "custom";

/**
 * Presets genéricos embebidos en código.
 * Demuestran la funcionalidad sin exponer estructuras internas de ningún sistema.
 *
 * TODO(fase-settings): Permitir administrar presets desde Settings usando
 * localStorage. Esta lista servirá como seed/fallback al cargar la app cuando
 * no existan presets personalizados guardados localmente.
 */
export const SQL_TABLE_PRESETS: SqlTablePreset[] = [
  {
    id: "users",
    label: "Users",
    description: "Usuarios de la aplicación y autenticación.",
    table: "users",
    defaultKey: "id",
    columns: [
      "id",
      "username",
      "email",
      "status",
      "created_at",
      "updated_at",
      "last_login",
      "is_locked",
      "role_id",
    ],
  },
  {
    id: "employees",
    label: "Employees",
    description: "Empleados con cargo y departamento.",
    table: "employees",
    defaultKey: "id",
    columns: [
      "id",
      "first_name",
      "last_name",
      "email",
      "department_id",
      "role_id",
      "hire_date",
      "status",
    ],
  },
  {
    id: "customers",
    label: "Customers",
    description: "Clientes y datos de contacto.",
    table: "customers",
    defaultKey: "id",
    columns: [
      "id",
      "name",
      "email",
      "phone",
      "city",
      "country",
      "created_at",
      "is_active",
    ],
  },
  {
    id: "documents",
    label: "Documents",
    description: "Documentos y metadatos asociados.",
    table: "documents",
    defaultKey: "id",
    columns: [
      "id",
      "title",
      "status",
      "owner_id",
      "created_at",
      "updated_at",
      "file_size",
      "is_deleted",
    ],
  },
  {
    id: "orders",
    label: "Orders",
    description: "Pedidos y estado de entrega.",
    table: "orders",
    defaultKey: "id",
    columns: [
      "id",
      "customer_id",
      "status",
      "total",
      "created_at",
      "shipped_at",
    ],
  },
];

export function getSqlTablePreset(id: string): SqlTablePreset | undefined {
  return SQL_TABLE_PRESETS.find((preset) => preset.id === id);
}

export function isCustomTablePreset(id: string): boolean {
  return id === CUSTOM_TABLE_PRESET_ID;
}
