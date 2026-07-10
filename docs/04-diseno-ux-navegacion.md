# 9. Guía de diseño UI/UX

## Principios de experiencia

1. **Productividad primero.** Cada pantalla responde: *¿qué quiero lograr en 30 segundos?*
2. **Densidad controlada.** Mucho espacio en blanco; pocos elementos por vista.
3. **Feedback inmediato.** Preview en vivo, estados de carga mínimos (todo local).
4. **Confianza antes de copiar.** El usuario siempre ve el output completo.
5. **Consistencia.** Misma estructura en todas las herramientas (ver layout de tool).
6. **Above the fold.** La funcionalidad principal debe ser visible e interactiva sin scroll. Si el usuario necesita desplazarse antes de empezar a trabajar, el diseño debe reconsiderarse.

## Identidad visual

### Marca

- Logo Devkit en sidebar.
- Nombre producto: **Devkit**.
- Colores corporativos **solo como acento**, nunca como fondo principal.

### Tipografía

- **Inter** (pesos 400, 500, 600, 700).
- Jerarquía:
  - Título de página: 24–30px, semibold
  - Subtítulo / descripción: 14–16px, color muted
  - Cuerpo: 14px
  - Labels / hints: 12px

### Color y tema

- **Dark mode por defecto** (`#090B10` fondo base aprox.).
- Light mode opcional para entornos muy iluminados.
- Bordes sutiles (`rgba white 8%` en dark).
- Sombras suaves en cards; evitar sombras duras.
- Border radius: 12px cards, 8px inputs/buttons.

### Inspiración (no copia)

| Producto | Qué tomar |
|----------|-----------|
| **Linear** | Sidebar limpio, estados activos sutiles, tipografía |
| **Raycast** | Command palette, velocidad, atajos |
| **Vercel** | Dashboard de cards, espaciado, profesionalismo |
| **GitHub** | Jerarquía, breadcrumbs, dark theme maduro |
| **Cursor** | Sensación de herramienta para builders |
| **Notion** | Claridad en bloques de contenido |

## Layout global

```
┌──────────┬──────────────────────────────────────────────┐
│          │  Header: breadcrumb · search · theme · user  │
│ Sidebar  ├──────────────────────────────────────────────┤
│ (collaps)│                                              │
│          │              Contenido principal             │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

- Sidebar: 256px expandido / ~68px colapsado.
- Header: 64px altura fija, sticky, blur backdrop.
- Contenido: max-width 1280px (dashboard) o según ancho de herramienta (`default` / `wide` / `full`).

## Layout estándar de una herramienta

Todas las tools deben seguir esta estructura para reducir curva de aprendizaje:

```
[Icono + Título + Badge estado]
[Descripción de una línea]

┌─ Entrada ─────────────────┐  ┌─ Resultado ──────────────┐
│ Formulario / textarea /    │  │ SqlPreview / diff view   │
│ upload zone                │  │ [Copiar] [Descargar v1.1]│
└────────────────────────────┘  └──────────────────────────┘

[Opciones avanzadas en Accordion colapsado]
```

### Regla: above the fold

Cada herramienta debe mostrar la **funcionalidad principal above the fold**: el usuario no debería tener que hacer scroll para empezar a trabajar.

| Debe verse sin scroll | Puede quedar debajo del fold |
|-----------------------|------------------------------|
| Primer campo o textarea de entrada | Preview extenso / diff completo |
| Selector de modo u operación principal | Resumen de comparación |
| Botón de acción principal (Generar, Comparar) | Opciones avanzadas |
| Zona de upload (si es el flujo principal) | Historial, estadísticas secundarias |

**Criterio de revisión:** al abrir la herramienta en un viewport estándar (1366×768, header visible), ¿puede el usuario pegar, escribir o subir contenido de inmediato? Si no, reducir header, eliminar contenedores innecesarios o mover bloques secundarios.

**Anti-patrones:**

- Card contenedora que solo envuelve todo el formulario («Espacio de trabajo»).
- Descripción de varias líneas antes del primer input.
- Bloques de opciones expandidos por defecto cuando no son esenciales para el primer uso.

### Superficie de trabajo

- **Una herramienta = una superficie.** Sin cards intermedias que envuelvan todo el formulario.
- Cards solo para bloques independientes: preview, resumen, resultados, historial.
- Desktop: dos columnas (entrada | salida) cuando aplique.
- Mobile: stack vertical (entrada arriba, resultado abajo).

## Componentes de interacción

| Patrón | Uso |
|--------|-----|
| Primary button | Acción principal (Generar, Comparar) |
| Ghost / outline | Secundarias (Limpiar, Reset) |
| Badge | Disponible / Beta / Próximamente |
| Toast | «Copiado al portapapeles» |
| Tooltip | Icon-only buttons |
| Tabs | Dialecto SQL Server / PostgreSQL |
| Accordion | Opciones avanzadas poco usadas |

## Microcopy (tono)

- Español claro, directo, sin jerga de marketing.
- Errores accionables: *«Pega al menos una fila con datos»* vs *«Error de validación»*.
- Empty states con CTA: *«Pega tu lista de IDs aquí para comenzar»*.

## Accesibilidad mínima (v1)

- Contraste WCAG AA en texto principal.
- Focus ring visible (color `--ring` = primary Rubrika).
- Labels en todos los inputs.
- `aria-label` en botones solo-icono.
- No depender solo del color para estados (usar texto/badge).

## Motion

- Transiciones 150–250ms ease-out.
- Hover sutil en cards (`translateY -1px`, border accent).
- Evitar animaciones largas o distractoras.

---

# 17. Flujo de navegación

## Mapa de rutas

```
/                          → Dashboard
/sql-tools                 → Listado herramientas SQL
/excel-tools               → Listado Excel
/text-tools                → Listado Texto
/database                  → Listado Database (beta+)
/ai-assistant              → Listado AI (futuro)
/settings                  → Configuración
/tools/:slug               → Herramienta individual ★
```

## Flujos principales

### Flujo A — Usuario recurrente (Raycast-style)

1. Abre Devkit → `⌘K`
2. Escribe «excel» → Enter
3. Pega datos → resultado instantáneo → Copiar

**Meta:** ≤ 3 acciones hasta el resultado.

### Flujo B — Exploración desde dashboard

1. Dashboard → card «SQL Tools»
2. Elige «SQL Formatter»
3. Trabaja en la herramienta

### Flujo C — Acceso directo / bookmark

1. Bookmark `/tools/compare-lists`
2. Entra directo sin pasar por dashboard

## Navegación lateral (orden fijo)

1. Dashboard
2. SQL Tools
3. Excel Tools
4. Text Tools
5. Database
6. AI Assistant
7. — separador —
8. Settings

## Breadcrumb

`Dashboard / SQL Tools / SQL Formatter`

- Siempre clickeable excepto el último segmento.
- En mobile puede colapsarse a solo el segmento actual.

## Command palette (⌘K)

Debe indexar:

- Todas las herramientas `available` y `beta`
- Módulos (categorías)
- Acciones rápidas: «Ir al dashboard», «Cambiar tema» (v1.1)

## Estados vacíos y errores de ruta

- Tool `coming-soon`: pantalla informativa, no 404.
- Slug inválido: 404 con enlace al dashboard.
- Módulo sin tools disponibles: empty state con roadmap.

---

# 18. Componentes reutilizables desde el inicio

Estos componentes deben existir en **Core** antes o en paralelo a la primera feature completa.

## Shell / navegación

| Componente | Responsabilidad |
|------------|-----------------|
| `AppShell` | Layout sidebar + header + main |
| `Sidebar` | Nav colapsable, logo, items activos |
| `Header` | Breadcrumb, search trigger, theme, user menu |
| `CommandPalette` | Búsqueda global ⌘K |

## Dashboard

| Componente | Responsabilidad |
|------------|-----------------|
| `ModuleCard` | Card de categoría con icono, count, estado |
| `ToolCard` | Card compacta de herramienta |
| `QuickAccess` | Chips de accesos rápidos |
| `RecentList` | Historial reciente |
| `FavoritesList` | Favoritos del usuario |

## Herramientas (shared)

| Componente | Responsabilidad |
|------------|-----------------|
| `ToolPageLayout` | Contenedor con padding y ancho máximo por herramienta |
| `ToolPageHeader` | Icono + título + badge + descripción (compacto) |
| `ToolPlaceholder` | Estado para herramientas sin implementar |
| `ToolWorkspace` | Grid entrada/salida responsive |
| `SqlPreview` | Textarea read-only monospace con syntax highlight básico |
| `CodeBlock` | Bloque copiable genérico (texto, JSON) |
| `CopyButton` | Copiar + toast confirmación |
| `PasteZone` | Textarea grande con placeholder y contador de líneas |
| `FileDropzone` | Drag & drop Excel/CSV (v1 excel tool) |
| `DialectTabs` | SQL Server / PostgreSQL |
| `DiffView` | Salida de Compare Lists (solo en diff, agregar en v1) |
| `EmptyState` | Ilustración mínima + mensaje + CTA |

## Formularios

| Componente | Responsabilidad |
|------------|-----------------|
| shadcn `Input`, `Select`, `Checkbox`, `Switch` | Form controls |
| `FormField` | Label + input + error helper (wrapper) |
| `OptionsAccordion` | Opciones avanzadas colapsadas |

## Feedback

| Componente | Responsabilidad |
|------------|-----------------|
| `Toast` / `Toaster` | Notificaciones efímeras |
| `Badge` | Estados Disponible / Beta / Próximamente |
| `InlineError` | Validación bajo campos |

## Prioridad de implementación

1. Shell + Command palette
2. `CopyButton`, `PasteZone`, `SqlPreview`
3. `ToolPageLayout`, `ToolPageHeader`, `ToolWorkspace`
4. Dashboard cards
5. `FileDropzone`, `DiffView` (cuando la feature lo requiera)
