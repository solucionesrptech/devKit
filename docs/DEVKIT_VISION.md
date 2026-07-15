# DevKit — Visión de producto

Documento oficial de visión. Fuente de verdad para producto, roadmap y reglas Cursor (`.cursor/rules/`).

## Estado de la arquitectura

La arquitectura base de DevKit está **aprobada y congelada**.

- Este documento (`DEVKIT_VISION.md`) es la fuente oficial de visión.
- `.cursor/rules/` son las reglas permanentes del proyecto.
- Toda funcionalidad nueva debe respetar ambas fuentes antes de proponer cambios.

Queda prohibido modificar sin **aprobación explícita**: categorías, filosofía, arquitectura, organización del catálogo, Workspace, contrato del Tool Registry y reglas Cursor.

Si hace falta cambiar alguno de esos elementos, primero se presenta una propuesta de arquitectura. No se rediseña el proyecto de oficio.

El modo de trabajo es: problema → impacto → revisar visión → revisar reglas → implementar.

## Qué es DevKit

DevKit es una plataforma web de productividad para desarrolladores.
Combina un **catálogo de herramientas** especializadas con un **Workspace**
(favoritos, recientes, historial, colecciones, pines).

Las herramientas priorizan procesamiento local (offline-first),
tareas claras y reutilización interna de componentes.

## Qué NO es DevKit

- No es un IDE ni un reemplazo de SSMS / Azure Data Studio / pgAdmin.
- No es un marketplace genérico de “1000 utilities”.
- No es una suite definida por formatos de archivo (Excel, PDF, CSV).
- No es, en su núcleo, una plataforma conectada a bases de producción.
- No agrega herramientas solo porque “serían útiles en abstracto”.

## Objetivos

1. Reducir fricción en tareas repetitivas de desarrollo y datos/SQL.
2. Sustituir scripts manuales y webs externas inseguras o lentas.
3. Mantener un catálogo honesto, navegable y profesional.
4. Evolucionar de catálogo → plataforma (Workspace + dominios claros).
5. Abrir capacidades conectadas (Database, AI) y plugins sin romper el ADN offline.

## Público objetivo

Desarrolladores, analistas técnicos y perfiles que generan o transforman
SQL, listas, archivos y datos estructurados en el día a día.

## Principios permanentes

### Una categoría representa un dominio

Ejemplos: SQL Tools, Compare, Encoding, Text Tools, Data Tools,
Developer Tools, Database.

Nunca crear categorías basadas únicamente en un formato de archivo
(Excel, PDF, CSV, Image, etc.). Esos formatos son inputs u outputs de una tarea.

### Una herramienta representa una tarea

Ejemplos: Generate UPDATE, Compare JSON, PDF → Base64, Text Cleaner.

No crear herramientas ambiguas (“Base64 Studio”, “Data Hub”).
La lógica compartida es interna; el catálogo muestra jobs independientes.

### Necesidad real

Toda herramienta nueva debe cumplir al menos uno:

- Resuelve un problema real encontrado durante el desarrollo.
- Automatiza una tarea repetitiva.
- Reemplaza una página web utilizada frecuentemente.
- Reduce errores humanos.
- Sustituye scripts manuales existentes.
- Surge de una necesidad real del trabajo.

No agregar herramientas solamente porque parecen interesantes.

## Categorías de dominio (catálogo)

| Categoría | Dominio |
|-----------|---------|
| **SQL Tools** | Generar y transformar scripts SQL offline |
| **Compare** | Diff y comparación (alrededor de Compare Studio) |
| **Encoding** | Codificar / decodificar representaciones |
| **Text Tools** | Limpiar y normalizar texto y listas |
| **Data Tools** | Transformar datos entre formatos estructurados |
| **Developer Tools** | Utilidades del flujo de desarrollo |
| **Database** | Herramientas sobre una BD real (conectada; futuro) |
| **AI Tools** | Asistencia acotada (futuro) |

**SQL Tools ≠ Database.** SQL Tools = scripts offline. Database = conexión / metadatos reales.

**Compare CSV** pertenece solo a Compare, no a Data Tools.
Data Tools es exclusivamente transformación de datos.

Excel no es un dominio: es un formato de entrada/salida.

## Workspace (capacidad transversal)

Workspace representa productividad personal. **No** es una categoría.
**No** pertenece al Tool Registry.

Capacidades previstas: Favoritos, Recientes, Historial, Colecciones, Pines.

## Core pequeño y plugins opcionales

DevKit mantiene un **Core** pequeño, sólido y altamente mantenible
(shell, registry, shared UI, dominios offline prioritarios).

Integraciones específicas (Oracle, MySQL, PostgreSQL, MongoDB, Redis,
Azure, AWS, SAP, etc.) se evalúan como **plugins o módulos opcionales**.
**No forman parte del Core.**

## Cómo nace una categoría

Nace cuando existe un dominio coherente explicable en una frase,
con varias tareas posibles, y no se reduce a un único formato de archivo.

## Cómo nace una herramienta

Nace cuando cumple la regla de necesidad real y:

- El usuario puede nombrarla como un job claro.
- Tiene entrada, acción y salida evidentes.
- Puede integrarse al Tool Registry y aparecer en Dashboard, Sidebar,
  Command Palette y su categoría.
- Prefiere offline y procesamiento local cuando sea posible.

## Cómo evoluciona el producto

1. Consolidar shell, catálogo honesto y Workspace básico.
2. Profundizar dominios de alto uso (SQL Tools, Compare, Text Tools).
3. Ampliar Encoding, Developer Tools y Data Tools por demanda real.
4. Introducir Database conectada y AI con governance.
5. Madurar Workspace (colecciones, pines).
6. Evaluar plugins/vendors fuera del Core.

## Checklist de aceptación de funcionalidades

- [ ] ¿Qué dominio la contiene?
- [ ] ¿Cuál es la tarea en una frase?
- [ ] ¿Qué reemplaza (web / script / proceso)?
- [ ] ¿Puede ser offline / local?
- [ ] ¿Reutiliza componentes existentes?
- [ ] ¿Entrará al registry y a la navegación estándar?
- [ ] ¿El status será honesto desde el día uno?
- [ ] ¿Es Core o plugin opcional?
