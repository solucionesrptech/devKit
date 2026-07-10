# Rubrika DevKit

Suite interna de herramientas para desarrolladores de Rubrika.

## Documentación

La definición de producto vive en **[docs/](./docs/README.md)**. Léela antes de implementar features o modificar arquitectura.

## Principios

- No es un editor SQL. Es una suite de herramientas modulares.
- Cada herramienta resuelve un problema específico con el menor número de clics posible.
- Arquitectura **Feature First**. Registry central para módulos y rutas.
- Stack: Next.js, TypeScript, Tailwind, shadcn/ui, Lucide. Sin Bootstrap.
- Dark mode por defecto. Identidad visual Rubrika (acentos corporativos).
- v1 sin backend salvo necesidad estricta.

## Stack

- [Next.js](https://nextjs.org)
- TypeScript
- Tailwind CSS
- shadcn/ui

## Desarrollo

```bash
npm run dev
npm run build
```

## Contribuir

Ver `docs/03-arquitectura.md` (estrategia nueva herramienta) y `docs/05-desarrollo-convenciones.md` (checklist PR).
