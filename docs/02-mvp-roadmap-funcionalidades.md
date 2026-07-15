# 3. Alcance del MVP

## Definición

El **MVP (v1.0)** es una aplicación web interna, sin backend, que incluye el **shell completo de la plataforma** (layout, navegación, command palette, dashboard) y un **conjunto mínimo de herramientas de alto impacto**, todas ejecutándose en el navegador.

## Incluido en MVP

### Plataforma (shell)

- Dashboard con módulos, accesos rápidos, favoritos e historial (persistencia local).
- Sidebar colapsable con navegación por módulos.
- Header con buscador global, breadcrumb, selector de tema, perfil placeholder.
- Command palette (⌘K).
- Página de Settings básica (preferencias de tema, atajos).
- Registro central de módulos y herramientas (catálogo único).
- Rutas independientes por herramienta.
- Dark mode por defecto; light mode opcional.
- Identidad visual DevKit (colores de marca como acento).

### Herramientas funcionales (v1.0)

| Herramienta | Problema que resuelve | Notas |
|-------------|----------------------|-------|
| **SQL Generator** | SELECT, INSERT, UPDATE, DELETE, EXEC a partir de tabla + columnas + datos | Selector SQL Server / PostgreSQL |
| **IN Clause Builder** | Generar `IN (...)` desde lista pegada o CSV | Puede ser sub-vista del SQL Generator o herramienta propia |
| **Excel / CSV → SQL** | Convertir filas a INSERT/UPDATE/MERGE | Parseo client-side (SheetJS o similar) |
| **SQL Formatter** | Beautify y normalizar SQL pegado | Sin conexión a BD |
| **Compare Lists** | Diff de IDs, RUT, emails u otras listas | Entrada por pegado; salida copiable |
| **Text Cleaner** | Trim, deduplicar, normalizar saltos, quitar vacíos | Complemento natural de Compare Lists |

### Comportamiento transversal MVP

- Copiar resultado al portapapeles con un clic.
- Preview del output antes de copiar.
- Validación inline de entradas (formato, filas vacías, tipos).
- Mensajes de error claros en español.
- Sin persistencia en servidor.

## Fuera del MVP (ver también sección 19)

- Conexión en vivo a SQL Server / PostgreSQL.
- Búsqueda de SPs/tablas/columnas contra BD real.
- AI SQL Assistant.
- Database Explorer visual con metadatos en vivo.
- Autenticación / SSO (salvo requisito de seguridad no negociable).
- Colaboración multi-usuario, plantillas compartidas en nube.
- Ejecución de SQL contra servidores.

## Supuestos del MVP

- Usuarios acceden desde navegador moderno (Chrome, Edge, Firefox recientes).
- Datos sensibles se procesan solo en el cliente; el usuario es responsable de no compartir pantalla en contextos sensibles.
- Volumen típico: listas de cientos a pocos miles de filas; no millones en v1.

---

# 4. Roadmap por versiones

## v1.0 — MVP «Productividad offline» (8–10 semanas orientativas)

**Meta:** Suite usable sin backend.

- Shell completo + 6 herramientas core (tabla anterior).
- Favoritos e historial en `localStorage`.
- Documentación de producto y guía de contribución.

## v1.1 — Pulido y adopción (4–6 semanas)

**Meta:** Retención y feedback.

- Atajos de teclado por herramienta.
- Export a archivo (.sql, .txt).
- Plantillas guardadas localmente (nombre de tabla, dialecto, opciones).
- Telemetría opt-in anónima o encuesta integrada.
- Mejoras UX según feedback piloto.
- Posible SSO si el acceso sale de red interna.

## v2.0 — Plataforma conectada (12+ semanas)

**Meta:** Herramientas que requieren metadatos reales.

- API interna (Next.js Route Handlers o servicio aparte).
- Autenticación corporativa.
- Conexión read-only a entornos de desarrollo/staging.
- Search Stored Procedures, tablas y columnas.
- Database Explorer (solo lectura).
- Auditoría de consultas generadas (log interno).

## v2.1 — Inteligencia asistida

**Meta:** IA acotada y útil.

- AI SQL Assistant con contexto de esquema (solo entornos permitidos).
- Sugerencias de índices / explicación de planes (fase exploratoria).
- Generación asistida con revisión humana obligatoria.

## v3.0 — Ecosistema (visión)

- Marketplace interno de herramientas por equipo.
- Snippets y macros compartidos.
- Integración CI (generación de scripts en pipelines).
- Plugins o módulos opcionales con contrato estable.

---

# 5. Lista de funcionalidades priorizadas

Escala: **P0** (MVP) · **P1** (v1.1) · **P2** (v2) · **P3** (futuro)

## SQL Tools

| Funcionalidad | Prioridad | Esfuerzo | Impacto |
|---------------|-----------|----------|---------|
| Generador SELECT | P0 | M | Alto |
| Generador INSERT | P0 | M | Alto |
| Generador UPDATE | P0 | M | Alto |
| Generador DELETE | P0 | S | Medio |
| Generador EXEC | P1 | M | Medio |
| IN Clause Builder | P0 | S | Alto |
| SQL Formatter | P0 | S | Alto |
| Scripts masivos (batch) | P1 | M | Alto |
| Search Stored Procedures (offline: pegar DDL) | P1 | S | Medio |
| Search Stored Procedures (con BD) | P2 | L | Alto |
| Search tablas / columnas (con BD) | P2 | L | Alto |

## Excel / Data Tools

| Funcionalidad | Prioridad | Esfuerzo | Impacto |
|---------------|-----------|----------|---------|
| Excel → SQL (INSERT) | P0 | M | Muy alto |
| CSV → SQL | P0 | S | Alto |
| Excel → UPDATE por clave | P1 | M | Alto |
| Validación de tipos por columna | P1 | M | Medio |

## Text Tools

| Funcionalidad | Prioridad | Esfuerzo | Impacto |
|---------------|-----------|----------|---------|
| Compare Lists (diff) | P0 | M | Alto |
| Text Cleaner | P0 | S | Medio |
| JSON/XML format & validate | P1 | M | Medio |
| Normalizar RUT / emails | P1 | S | Medio |

## Plataforma

| Funcionalidad | Prioridad | Esfuerzo | Impacto |
|---------------|-----------|----------|---------|
| Dashboard + módulos | P0 | M | Alto |
| Command palette | P0 | S | Alto |
| Favoritos / historial local | P0 | S | Medio |
| Selector SQL Server / PostgreSQL | P0 | S | Alto |
| Theme dark/light | P0 | S | Medio |
| Settings | P0 | S | Bajo |

## Database / AI (post-MVP)

| Funcionalidad | Prioridad | Esfuerzo | Impacto |
|---------------|-----------|----------|---------|
| Database Explorer | P2 | L | Alto |
| AI SQL Assistant | P2–P3 | L | Medio (depende de política IA) |

---

# 19. Qué NO desarrollar en la primera versión

Evitar scope creep. Estas capacidades **explícitamente quedan fuera de v1.0**:

| Exclusión | Motivo |
|-----------|--------|
| Ejecutar SQL en servidores | Riesgo de seguridad y operaciones; fuera del propósito |
| Conexión directa a producción | Solo lectura en dev/staging recién en v2, con auth |
| Backend propio / base de datos de la app | Contradice enfoque v1; añade ops innecesarias |
| Autenticación compleja | Solo si seguridad lo exige; si no, red interna |
| AI generativa libre | Coste, compliance, calidad impredecible |
| Editor SQL multi-tab persistente | Desvía hacia producto distinto (IDE) |
| Sincronización multi-dispositivo | Requiere backend y cuenta de usuario |
| Roles y permisos granulares | Overhead para herramienta interna v1 |
| Internacionalización completa | Español primero; i18n en v2 si hace falta |
| Mobile-first | Desktop/laptop es el contexto real de uso |
| Importar Bootstrap u otra UI library | Rompe consistencia y guía de diseño |
| Herramientas “placeholder” sin lógica | Mejor ocultar o marcar “Próximamente” sin ruta rota |

**Mejor alternativa:** marcar herramientas futuras en el catálogo con estado `Próximamente` o `Beta`, sin simular funcionalidad.
