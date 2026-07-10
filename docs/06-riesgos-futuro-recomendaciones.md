# 12. Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Scope creep** hacia «editor SQL completo» | Alta | Alto | Documento de exclusiones v1; revisión de PR estricta |
| **Bundle size** por SheetJS u otras libs | Media | Medio | Dynamic import; lazy load por ruta |
| **SQL generado incorrecto** (escape, tipos) | Media | Muy alto | Tests exhaustivos; preview; warnings en DML |
| **Datos sensibles en browser** | Media | Alto | Procesamiento local; política interna; sin analytics de contenido |
| **Divergencia SQL Server / PostgreSQL** | Alta | Medio | Abstracción `SqlDialect`; tests por dialecto |
| **Deuda en shell** si se apresuran features | Media | Alto | Completar shared components antes de parallelizar tools |
| **Sin auth en red expuesta** | Baja–Media | Alto | Validar despliegue; SSO en v1.1 si aplica |
| **Adopción baja** | Media | Alto | Piloto con 3 usuarios; iterar en herramientas P0 |
| **Metadatos BD sin backend** | Alta | Medio | v1 offline; no prometer search SP en vivo |
| **Single maintainer** | Media | Medio | Docs + Feature First + registry claro |
| **Regresiones al agregar tools** | Media | Medio | CI con tests unitarios obligatorios |

## Riesgos de producto

- **Herramientas demasiado genéricas** → poca adopción. Mitigación: una tool, un job-to-be-done.
- **Demasiadas opciones visibles** → parálisis. Mitigación: defaults inteligentes + accordion avanzado.
- **Copiar SQL destructivo a prod** → incidente. Mitigación: confirmaciones UX, color warning en DELETE/UPDATE sin WHERE.

---

# 15. Ideas para futuras versiones

## Productividad

- **Snippets corporativos:** plantillas de JOINs, filtros estándar, convenciones de nombres Rubrika.
- **Historial sincronizado** con cuenta (post-auth).
- **Workspaces:** guardar sesiones («Proyecto X – migración usuarios»).
- **Batch runner:** cola de generaciones (100 archivos CSV → 100 `.sql`).

## Datos y SQL

- **Visual query builder** ligero (no reemplazo de SSMS; solo SELECT simples).
- **Diff de esquemas** entre dos scripts DDL pegados.
- **Generador de MERGE** SQL Server / `ON CONFLICT` PostgreSQL.
- **Detección de PII** en datos pegados (alerta antes de copiar).

## Integración

- **Extensión VS Code / Cursor** que abra DevKit con contexto del archivo actual.
- **Webhook interno** para generar scripts desde tickets Jira/Linear.
- **CLI companion** para mismas funciones en terminal (`rubrika-devkit csv2sql`).

## AI (con governance)

- Explicar plan de ejecución en lenguaje natural.
- Sugerir índices a partir de SELECT frecuente.
- Convertir requerimiento de negocio → borrador SQL **siempre editable**.
- Política: sin enviar datos de prod a modelos externos.

## Colaboración

- Compartir link a configuración de tool (query params, sin datos).
- Comentarios internos por herramienta (v3).

---

# 20. Recomendaciones adicionales

## Organización del equipo

- Designar **Product Owner interno** (aunque sea part-time) para priorizar backlog.
- **Tech Lead** custodia arquitectura y registry.
- Rotación opcional: cada dev puede «adoptar» una tool nueva.

## Piloto antes del lanzamiento amplio

1. Seleccionar 3–5 usuarios de perfiles distintos (dev backend, analista, soporte).
2. Duas semanas de uso real con canal Slack/Teams de feedback.
3. Medir: tiempo antes/después en 2 tareas concretas (Excel→SQL, IN clause).

## Documentación viva

- Mantener `docs/` como fuente de verdad de producto.
- Cada feature puede tener README corto operativo (no duplicar producto).
- `CONTRIBUTING.md` para devs internos (checklist nueva herramienta).

## Alineación con código existente

Si ya existe un prototipo de UI (shell, dashboard), **validarlo contra esta documentación** antes de continuar:

| Aspecto | Doc dice | Validar en código |
|---------|----------|-------------------|
| Registry único | `lib/config/registry.ts` | ¿Metadatos duplicados? |
| Feature folders | `features/<id>/` | ¿Lógica solo en pages? |
| Tools placeholder | Evitar rutas vacías | ¿Marcar coming-soon? |
| Shared components | SqlPreview, CopyButton | ¿Existen o están inline? |

## Mejora sugerida vs. prompt original: «IN Clause Builder»

En lugar de esconderlo dentro de SQL Generator, recomendamos **herramienta dedicada** en MVP:

- **Por qué:** caso de uso ultra frecuente, 1 campo de entrada, resultado inmediato.
- **Beneficio:** menos clics que abrir un generador completo.
- Puede compartir `lib/sql/in-clause.ts` con SQL Generator internamente.

## Mejora sugerida: «Text Cleaner» antes de JSON/XML Tools

Priorizar **Text Cleaner** en P0 y **JSON/XML** en P1:

- **Por qué:** resuelve el 80 % de limpieza de listas antes de compare/IN.
- JSON/XML añade validación y edge cases; menor frecuencia diaria según el problema statement.

## Métricas simples desde v1.1

- Contador local «veces usada» por tool (opt-in export anónimo).
- No registrar contenido pegado; solo `tool_id` + timestamp.

## Definition of Ready para iniciar desarrollo funcional

Antes de escribir la primera feature completa, debe estar listo:

- [ ] Decisiones abiertas críticas resueltas (acceso, dialecto prioritario, BD en vivo sí/no)
- [ ] Shell según doc de navegación
- [ ] Registry implementado
- [ ] Componentes shared: `PasteZone`, `SqlPreview`, `CopyButton`
- [ ] Primera feature piloto: **IN Clause Builder** o **SQL Formatter** (baja complejidad, alto valor)

## Conclusión

Rubrika DevKit tiene potencial de convertirse en **infraestructura de productividad interna** si se mantiene disciplina modular y resistencia al scope creep. El MVP debe sentirse **completo pero pequeño**: pocas herramientas excelentes, no muchas a medias.

La documentación en `docs/` debe evolucionar con el producto. Cualquier cambio de alcance empieza por actualizar `02-mvp-roadmap-funcionalidades.md` y comunicar al equipo.
