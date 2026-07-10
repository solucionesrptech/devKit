# 1. Visión del producto

## Visión

**Devkit** será la plataforma interna de productividad para el equipo técnico de Rubrika: un lugar único, rápido y confiable donde resolver tareas repetitivas de desarrollo y datos en segundos, no en minutos.

No compite con un IDE ni con un cliente SQL. Compite con el tiempo perdido en tareas manuales: copiar filas de Excel, armar un `IN (...)` de cien IDs, formatear un script sucio o comparar dos listas de RUT.

La plataforma debe sentirse como una herramienta que un desarrollador abre varias veces al día — al nivel de productos como Linear o Raycast en claridad y velocidad — pero con identidad Rubrika y enfoque en problemas reales del día a día.

## Propuesta de valor

| Para el usuario | Para Rubrika |
|-----------------|--------------|
| Menos clics, menos errores, menos sintaxis memorizada | Menor tiempo en tareas operativas |
| Una sola suite en lugar de scripts dispersos | Conocimiento encapsulado y reutilizable |
| Experiencia moderna y predecible | Base escalable para nuevas herramientas internas |

## Qué NO es Devkit

- No es un editor SQL ni un reemplazo de SSMS, Azure Data Studio o pgAdmin.
- No es un ETL ni un sistema de migración de datos.
- No es un producto comercial externo (en v1 es herramienta interna).
- No es un chatbot genérico; el asistente IA (futuro) está acotado a tareas de desarrollo.

## Filosofía de producto

1. **Resolver problemas, no emitir SQL.** El usuario piensa en términos de negocio (*“tengo esta lista de IDs”*, *“necesito un UPDATE masivo”*), no en gramática SQL.
2. **Velocidad perceptible.** Interacciones instantáneas, atajos de teclado, command palette, resultados visibles sin pasos extra.
3. **Mínimos clics.** Cada pantalla debe justificar cada campo y botón.
4. **Un módulo, un problema.** Evitar herramientas “cajón de sastre”.
5. **Confianza.** El usuario debe entender qué hace la herramienta y poder copiar/revisar el resultado antes de ejecutarlo en producción.
6. **Modularidad desde el día uno.** Agregar una herramienta no debe requerir reescribir el shell de la aplicación.

---

# 2. Objetivos del proyecto

## Objetivos de negocio

| Objetivo | Indicador orientativo |
|----------|------------------------|
| Reducir tiempo en tareas repetitivas | Tareas de 5–15 min → &lt; 1 min |
| Centralizar utilidades internas | Una URL, un catálogo de herramientas |
| Estandarizar outputs SQL | Misma convención entre equipos |
| Facilitar onboarding técnico | Herramientas autodocumentadas y predecibles |

## Objetivos de producto

- Entregar un **MVP usable** con las herramientas de mayor impacto.
- Lograr **adopción voluntaria** (que el equipo prefiera Devkit frente a Excel + Notepad).
- Mantener **time-to-add-tool** bajo: una nueva herramienta = días, no semanas.

## Objetivos técnicos

- Aplicación **100 % frontend** en v1 (procesamiento en cliente).
- Arquitectura **Feature First** y registro central de módulos/herramientas.
- UI consistente con **shadcn/ui**, dark mode, identidad Rubrika.
- Código **TypeScript estricto**, testeable y documentado.
- Preparación para v2 (auth, API, conexión BD) sin deuda en el núcleo.

## Objetivos de experiencia (UX)

- First meaningful interaction en **&lt; 3 segundos** tras abrir una herramienta.
- **Command palette** (⌘K / Ctrl+K) para saltar a cualquier herramienta.
- **Responsive** usable en laptop; mobile como complemento, no foco v1.
- Accesibilidad razonable: contraste, foco visible, labels en formularios.

## Criterios de éxito del MVP

- [ ] Al menos **5 herramientas** completamente funcionales offline.
- [ ] Dashboard con accesos rápidos, favoritos e historial local.
- [ ] Catálogo navegable por módulos.
- [ ] Feedback positivo de **≥ 3 usuarios piloto** del equipo técnico.
- [ ] Documentación de producto y de contribución actualizada.
