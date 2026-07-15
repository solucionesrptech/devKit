# SQL Generator — Notas de arquitectura

## Operaciones soportadas

### SELECT y DELETE (formulario IN)

Comparten el **mismo formulario** porque el modelo de entrada es idéntico:

| Campo | Descripción |
|-------|-------------|
| Tabla | Nombre literal de la tabla |
| Columna WHERE | Columna usada en la cláusula `WHERE ... IN (...)` |
| Lista de valores | Un valor por línea (texto) o columna de Excel/CSV |
| Tipo de dato | Número o texto (formato del `IN`) |

Componentes: `sql-in-clause-form.tsx`, `generate-select.ts`, `generate-delete.ts`, `generate-sql.ts`.

#### DELETE físico vs borrado lógico

- **Borrado lógico:** usar **UPDATE** sobre la columna `is_deleted` (u otra columna de estado). Es el flujo recomendado.
- **DELETE:** borrado **físico** permanente. Permanece disponible pero no se promueve como operación principal.
- La UI muestra una nota al seleccionar DELETE: *"Para borrado lógico usa UPDATE sobre la columna is_deleted."*

### UPDATE (formulario dedicado)

**No reutiliza** el formulario de SELECT/DELETE.

| Campo | Descripción |
|-------|-------------|
| Tabla | Nombre literal de la tabla |
| Columna WHERE | Columna del filtro (`WHERE col = valor`) |
| Tipo dato WHERE | Número o texto |
| Assignments | Colección de columnas SET con valor y tipo propios |
| Valores WHERE | Un valor por línea (texto) o columna Excel/CSV |

```ts
type UpdateAssignment = {
  column: string;
  value: string;
  dataType: ValueDataType | "null";
};
```

Componentes: `sql-update-form.tsx`, `update-assignments-table.tsx`, `text-update-input.tsx`, `excel-update-input.tsx`, `generate-update.ts`, `generate-update-sql.ts`.

## Formato de salida UPDATE

### Modos de generación

| Modo | Comportamiento |
|------|----------------|
| **Automático** (default) | Si el SET es homogéneo para todos los registros, genera un único `UPDATE` con `WHERE IN`. Si no, genera UPDATEs individuales. |
| **Un UPDATE por fila** | Siempre genera una sentencia por cada valor WHERE. |

Hoy el SET es global (`assignments[]` único), por lo que en modo Automático siempre se usa `WHERE IN`. La función `isHomogeneousSet` queda preparada para SET distinto por fila en el futuro.

### Ejemplo bulk (modo Automático)

```sql
-- 3 registros · UPDATE masivo (WHERE IN)
UPDATE users
SET
    is_locked = 1
WHERE id IN (
    'user-003',
    'user-004',
    'user-005'
);
```

### Ejemplo individual (modo per-row)

```sql
-- 2 registros · UPDATE individual
UPDATE users
SET
    last_login = NULL,
    is_locked = 0
WHERE id = 'user-001';

UPDATE users
SET
    last_login = NULL,
    is_locked = 0
WHERE id = 'user-002';
```

El preview muestra el tipo de generación: `UPDATE masivo (WHERE IN)` o `UPDATE individual`.

## Validación (modo seguro)

Sección **Validación** en el formulario UPDATE con tres opciones (defaults: SELECT previo + UPDATE, sin SELECT posterior):

- `format-validation-select.ts` — SELECT con `WHERE IN` usando los mismos `whereValues`.
- `compose-update-validation.ts` — ensambla bloques con banners; **no modifica** `generateUpdate()`.
- `GO` como separador solo en dialecto SQL Server.

Los SELECT de validación siempre usan `WHERE IN` (bulk e individual). El UPDATE respeta el modo Automático o por fila sin cambios. No hay conexión a base de datos.

`buildUpdateValidationBlocks` expone cada bloque por separado para copia individual. `joinValidationBlocks` / copia completa incluye `GO` en SQL Server; los botones secundarios copian un solo bloque sin `GO`. Los botones visibles dependen de los checkboxes activos.

## Entrada de datos UPDATE

- **Assignments:** tabla editable con columna, valor, tipo (Número / Texto / NULL) y filas dinámicas.
- **Valores WHERE (texto):** un valor por línea.
- **Valores WHERE (Excel/CSV):** una columna del archivo.

## Presets de tabla

Definidos en `lib/config/sql-presets.ts`. Aplican a SELECT, DELETE y UPDATE.

- SELECT/DELETE: tabla + columna WHERE.
- UPDATE: tabla + columna WHERE + selector de columnas SET desde el preset.

TODO(fase-settings): administrar presets desde Settings con localStorage.

## Catálogo

UPDATE vive dentro del mismo módulo SQL Generator. **No** es una herramienta separada en `lib/config/modules.ts`.

## Rendimiento

Entrada por texto usa `useDebouncedValue` (300 ms) para parseo y preview, igual que SELECT/DELETE.

### Listas grandes (hasta 10.000+ registros)

- **Sin límite** de registros procesados.
- **SQL completo** en memoria para copiar; **preview truncado** en pantalla (50 sentencias o 50 líneas del `IN`).
- `truncate-sql-preview.ts` + `build-generation-result.ts` separan `sql` (completo) de `previewSql` (visible).
- `generationMeta` expone: registros, tipo, tiempo (ms), si el preview fue limitado.
- Listas ≥ 500 registros usan `useDeferredValue` para no bloquear la UI durante la generación.
- `extractColumnValues` extrae columnas sin join/split intermedio; conserva duplicados por defecto.
- **Reporte de calidad** siempre calculado: filas detectadas, válidos, únicos, duplicados, vacíos y omitidos por límite.
- Numeración de filas: texto 1-based; Excel fila 2 = primera fila de datos (fila 1 = encabezado).
- Lista de duplicados con valor, cantidad y filas; botones **Ver duplicados** y **Descargar duplicados (.csv)**.
- La herramienta **informa, no modifica** los datos; deduplicación solo con checkbox explícito.
- Opción **Quitar duplicados** aplica deduplicación solo a los valores usados en el SQL.
- Tope de **10.000** registros válidos; por encima muestra error sin generar SQL (reporte completo igual).
- UPDATE en modo Automático genera un solo `WHERE IN` (óptimo para miles de registros).
