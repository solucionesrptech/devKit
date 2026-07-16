# 10, 14, 16. Desarrollo y convenciones

## Stack y herramientas

| Área | Tecnología |
|------|------------|
| App | Next.js 16 (App Router), React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4, tokens en `app/globals.css` |
| UI | shadcn/ui, Radix, Lucide |
| Tests | Vitest |
| Lint | ESLint (`eslint-config-next`) |
| Package manager | npm |

Scripts:

```bash
npm run dev
npm run lint
npm run test
npm run build
```

---

## Convenciones de código

### TypeScript / React

- Preferir componentes de función y Client Components solo cuando haya estado, efectos o APIs del navegador.
- Lógica pura (parsers, generadores SQL, diffs) en `features/<id>/lib/` — testeable sin DOM.
- Tipos de dominio en `types.ts` de la feature; evitar `any`.
- Imports con alias `@/` según `tsconfig.json`.
- No añadir `useMemo` / `useCallback` por defecto; usarlos cuando el coste sea real (listas grandes, editors).
- Para listas pesadas, considerar `useDeferredValue` / debounce (`useDebouncedValue`).

### Naming

| Qué | Convención | Ejemplo |
|-----|------------|---------|
| Feature folder | kebab-case | `sql-generator`, `compare-studio` |
| Page component | PascalCase + Page | `SqlGeneratorPage` |
| Lib functions | camelCase verbos | `generateSelect`, `parseValuesFromText` |
| CSS tokens | `--devkit-*` | `--devkit-primary` |
| Tailwind color | `*-devkit-*` | `text-devkit-primary` |
| localStorage | `devkit-*` | `devkit-theme` |
| Monaco themes | `devkit-dark` / `devkit-light` | |

### Estilos

- Tokens de marca: `--devkit-primary`, `--devkit-secondary`, `--devkit-accent`, `--devkit-text`, `--devkit-neutral`.
- Usar clases Tailwind; **no** estilos en línea.
- **No** usar `!important`.
- Dark mode por defecto vía `data-theme` en `<html>`.
- Assets solo de DevKit (`public/devkit.png`, `public/devkit-mark.png`).

### Textos y branding

- Producto: **DevKit** (en UI a veces “Devkit” según copy existente; no introducir otras marcas).
- Placeholders de usuario: `DevKit User` / `user@devkit.local`.
- Presets SQL: conservar exactamente los nombres reales configurados de tablas y columnas. Los fixtures y ejemplos de pruebas pueden seguir usando nombres genéricos.
- Microcopy en español, claro y accionable.

### Archivos y carpetas

- Una feature = una carpeta autocontenida.
- Tests colocalizados en `features/<id>/__tests__/`.
- Componentes UI genéricos en `components/ui`; patrones de tools en `components/shared`.
- No crear carpetas `legacy-*` para marcas antiguas; el historial vive en Git.

---

## Buenas prácticas por tipo de cambio

### Nueva herramienta

Seguir la checklist de `03-arquitectura.md` (Feature First + registry).

### Cambio en SQL Generator / Compare Studio

- Actualizar tests del comportamiento modificado.
- Si cambia el contrato de generación, actualizar `ARCHITECTURE.md` de la feature.
- Mantener preview truncado vs SQL completo separados cuando aplique.

### Cambio de tokens / tema

- Renombrar en `globals.css` y **todas** las referencias de clase.
- Si cambia una clave `localStorage`, migrar la antigua una vez y dejar de escribirla.

---

## Librerías permitidas (v1)

| Uso | Librería | Notas |
|-----|----------|-------|
| UI primitives | Radix + shadcn | Ya en el proyecto |
| Iconos | lucide-react | No mezclar packs |
| Excel/CSV | xlsx | Dynamic import si el bundle crece |
| Diff/editor | @monaco-editor/react | Temas DevKit |
| Toasts | sonner | Vía `ClientToaster` |
| Class merge | clsx + tailwind-merge | `cn()` en `lib/utils` |

Evitar:

- Bootstrap u otra UI kit paralela
- State managers globales sin necesidad
- Envío de datos pegados a servicios externos
- Dependencias nuevas “por si acaso”

---

## Testing

- **Obligatorio** para lógica pura nueva o modificada (generadores, parsers, diffs, validaciones).
- Nombres de tests descriptivos en español o inglés, consistentes con el archivo.
- Fixtures genéricos: `users`, `user-001`, `101` — no IDs ni tablas de sistemas reales.
- Ejecutar `npm run test` antes de dar por cerrado un cambio de lógica.

---

## Checklist de PR / entrega

- [ ] Alcance acotado; sin refactors colaterales no pedidos
- [ ] Docs de producto actualizadas si cambió alcance/arquitectura/UX
- [ ] Sin referencias a marcas externas (código, CSS, assets, textos, claves)
- [ ] `npm run lint` OK
- [ ] `npm run test` OK
- [ ] `npm run build` OK
- [ ] Sin estilos en línea ni `!important`
- [ ] Presets/ejemplos anonimizados

---

## Reglas del agente (Cursor)

Las reglas persistentes viven en `.cursor/rules/`. Complementan esta guía; en caso de duda, prevalecen los docs de producto y el código existente del módulo tocado.
