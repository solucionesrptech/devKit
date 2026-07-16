# 6–8, 11–13. Arquitectura

## Visión técnica

DevKit es una aplicación **Next.js (App Router) + TypeScript** orientada a herramientas de productividad que se ejecutan **100 % en el cliente** en v1. El shell (sidebar, header, dashboard, command palette) es estable; cada herramienta vive como **feature aislada** y se registra en un catálogo central.

Principios:

1. **Feature First** — lógica de dominio en `features/<id>/`, no en `app/`.
2. **Registry central** — metadatos de módulos/herramientas y mapeo de páginas en `lib/config/`.
3. **Shared UI** — componentes reutilizables en `components/shared` y primitivas shadcn en `components/ui`.
4. **Sin backend en v1** — sin API routes de negocio, sin BD de la app.
5. **Identidad DevKit** — tokens CSS `--devkit-*`, assets en `public/devkit*`, sin marcas de terceros.

---

## Estructura de carpetas

```
DevKit/
├── app/                      # Rutas Next.js (App Router)
│   ├── layout.tsx            # Metadata, fuente, tema base
│   ├── globals.css           # Tokens DevKit + tema dark/light
│   └── (app)/                # Shell autenticado/placeholder
│       ├── layout.tsx        # ThemeProvider + AppShell
│       ├── page.tsx          # Dashboard
│       ├── [category]/      # Listado por módulo
│       ├── settings/         # Preferencias
│       └── tools/[slug]/    # Página dinámica de herramienta
├── components/
│   ├── layout/               # AppShell, Sidebar, Header
│   ├── dashboard/            # Cards del dashboard
│   ├── shared/               # ToolPage*, PasteZone, CopyButton, etc.
│   └── ui/                   # Primitivas shadcn/ui
├── features/
│   ├── sql-generator/        # Feature completa + tests + ARCHITECTURE.md
│   ├── compare-studio/
│   └── pdf-base64/
├── lib/
│   ├── config/
│   │   ├── modules.ts        # Catálogo módulos + tools (nav)
│   │   ├── tool-pages.ts     # Slug → Component + layout
│   │   └── sql-presets.ts    # Presets de tablas frecuentes
│   ├── hooks/
│   └── utils.ts
├── providers/                # Theme, Sidebar
├── public/                   # Assets DevKit (devkit.png, devkit-mark.png)
├── docs/                     # Documentación de producto
└── .cursor/rules/            # Reglas persistentes para el agente
```

### Responsabilidades

| Capa | Responsabilidad | No debe |
|------|-----------------|---------|
| `app/` | Routing, layouts, composición de páginas | Lógica de negocio, parsers, generadores |
| `features/<id>/` | UI de la tool, `lib/`, `types`, tests | Conocer el shell más allá de shared components |
| `lib/config/` | Catálogo y presets | Implementar features |
| `components/shared` | Patrones transversales de tools | Dependencias de una feature concreta |
| `components/ui` | Primitivas de diseño | Copy de producto |

---

## Registro de módulos y herramientas

Hoy existen dos puntos de configuración (sin refactorizar en esta etapa):

1. **`lib/config/modules.ts`** — módulos, tools, navegación, estados (`available` / `beta` / `coming-soon`).
2. **`lib/config/tool-pages.ts`** — mapeo `slug → { Component, layoutWidth, description }`.

Flujo de resolución en `/tools/[slug]`:

```
slug → getToolById(slug) → metadatos (nombre, icono, estado)
     → getToolPage(slug) → Component de features/ o ToolPlaceholder
```

Herramientas sin entrada en `tool-pages` muestran `ToolPlaceholder` (no 404).

---

## Estrategia para agregar una nueva herramienta

1. Crear `features/<tool-id>/` con:
   - página principal (`*-page.tsx`)
   - `index.ts` que exporta el page component
   - `lib/` para lógica pura
   - `__tests__/` para Vitest
   - `types.ts` si aplica
2. Registrar metadatos en `lib/config/modules.ts` (`tools` + módulo padre).
3. Registrar la página en `lib/config/tool-pages.ts`.
4. Reutilizar `ToolPageLayout`, `ToolPageHeader`, `ToolWorkspace`, `CopyButton`, etc.
5. Documentar comportamiento no obvio en un `ARCHITECTURE.md` de la feature si es compleja.
6. Añadir tests unitarios de la lógica pura (parsers, generadores, diffs).

Checklist mínimo:

- [ ] Un problema claro, un slug estable
- [ ] Estado correcto en el catálogo
- [ ] Sin lógica de negocio en `app/`
- [ ] Sin assets ni textos de marcas externas
- [ ] Lint + tests + build en verde

---

## Decisiones técnicas iniciales

| Decisión | Elección | Motivo |
|----------|----------|--------|
| Framework | Next.js App Router | Routing, RSC donde aporta, ecosistema |
| Lenguaje | TypeScript estricto | Contratos claros entre features |
| Estilos | Tailwind v4 + tokens CSS DevKit | Consistencia, dark/light |
| UI kit | shadcn/ui + Radix + Lucide | Accesibilidad y composición |
| Estado global | Providers locales (theme, sidebar) | Sin Redux; estado de tool en React local |
| Persistencia v1 | `localStorage` (`devkit-*`) | Preferencias; sin servidor |
| SQL Excel | SheetJS (`xlsx`) client-side | Sin upload a servidor |
| Diff editor | Monaco (`@monaco-editor/react`) | Temas `devkit-dark` / `devkit-light` |
| Tests | Vitest | Unit tests de lógica pura |
| Backend v1 | Ninguno | Procesamiento en navegador |

### Claves de persistencia

| Clave | Uso |
|-------|-----|
| `devkit-theme` | Tema dark/light |

Migración: si existe una clave de tema legacy previa al rebrand, se copia una vez a `devkit-theme` y se elimina. Tras eso solo se escribe `devkit-theme`.

### Presets SQL

Los presets en `lib/config/sql-presets.ts` representan tablas frecuentes reales. Sus nombres de tabla, columnas, mayúsculas y minúsculas forman parte del contrato SQL y no deben traducirse, normalizarse ni reemplazarse por nombres genéricos sin autorización explícita.

---

## Límites de arquitectura (v1)

- No introducir API routes de negocio sin actualizar este documento.
- No acoplar features entre sí; compartir solo vía `components/shared` o `lib/` genérico.
- No duplicar metadatos de tools fuera de `lib/config/` (salvo que una etapa posterior unifique el registry).
- No conservar branding, assets ni claves de almacenamiento de marcas anteriores.

---

## Relación con otras docs

- Producto y alcance: `02-mvp-roadmap-funcionalidades.md`
- UX y navegación: `04-diseno-ux-navegacion.md`
- Convenciones de código y PR: `05-desarrollo-convenciones.md`
- Riesgos: `06-riesgos-futuro-recomendaciones.md`
