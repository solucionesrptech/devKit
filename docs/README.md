# Devkit — Documentación de producto

Documentación base del proyecto, definida antes del desarrollo funcional.

## Índice

| # | Documento | Contenido |
|---|-----------|-----------|
| — | [Decisiones abiertas](./00-decisiones-abiertas.md) | Preguntas pendientes de validación |
| 1–2 | [Visión y objetivos](./01-vision-y-objetivos.md) | Visión del producto y objetivos del proyecto |
| 3–5, 19 | [MVP, roadmap y alcance](./02-mvp-roadmap-funcionalidades.md) | Alcance MVP, versiones, priorización y exclusiones |
| 6–8, 11–13 | [Arquitectura](./03-arquitectura.md) | Arquitectura, carpetas, estrategia modular, decisiones técnicas |
| 9, 17–18 | [Diseño UX y navegación](./04-diseno-ux-navegacion.md) | Guía UI/UX, flujo de navegación, componentes base |
| 10, 14, 16 | [Desarrollo y convenciones](./05-desarrollo-convenciones.md) | Consistencia de código, buenas prácticas, librerías |
| 12, 15, 20 | [Riesgos, futuro y recomendaciones](./06-riesgos-futuro-recomendaciones.md) | Riesgos técnicos, ideas futuras, recomendaciones adicionales |

## Principios inmutables

- Devkit es una **suite de herramientas**, no un editor SQL.
- Cada herramienta resuelve **un problema específico** con el **menor número de clics** posible.
- Arquitectura **Feature First** y **100 % modular**.
- Stack: **Next.js, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons**.
- **Sin Bootstrap**. Dark mode por defecto. Identidad visual Rubrika.
- **Sin backend en v1**, salvo necesidad estricta.

## Mantenimiento de esta documentación

- Actualizar el documento correspondiente cuando cambie alcance, arquitectura o diseño.
- Registrar decisiones cerradas en `03-arquitectura.md` (sección Decisiones técnicas).
- Mover preguntas resueltas desde `00-decisiones-abiertas.md` a la sección de decisiones.
