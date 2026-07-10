# Decisiones abiertas

Antes de cerrar el MVP y comenzar el desarrollo funcional, conviene validar estos puntos con el equipo. Las respuestas pueden modificar alcance, arquitectura o prioridades.

---

## 1. Acceso y despliegue

| Pregunta | Impacto |
|----------|---------|
| ¿La app será accesible solo en red interna/VPN o también vía URL pública con autenticación? | Define si v1 puede omitir auth o si se necesita SSO desde el inicio |
| ¿Quién despliega y mantiene la app (IT, equipo dev, ambos)? | Afecta CI/CD, hosting y soporte |

**Recomendación provisional:** v1 sin login si el acceso es solo por red interna; SSO corporativo en v1.1 si se expone fuera de la VPN.

---

## 2. Motor de base de datos prioritario

| Pregunta | Impacto |
|----------|---------|
| ¿SQL Server y PostgreSQL tienen la misma prioridad, o uno va primero? | Afecta generadores SQL, sintaxis por defecto y pruebas |
| ¿Existen convenciones internas de nombres (esquemas, prefijos de tablas, SPs)? | Permite plantillas y defaults más útiles |

**Recomendación provisional:** SQL Server como dialecto por defecto en MVP; PostgreSQL como selector en cada herramienta SQL. Ambos soportados en generadores core.

---

## 3. Datos sensibles y privacidad

| Pregunta | Impacto |
|----------|---------|
| ¿Los usuarios pegarán datos reales (RUT, correos, IDs de clientes) en Excel/CSV/listas? | Refuerza la necesidad de procesamiento 100 % client-side |
| ¿Hay política interna sobre almacenar historial/favoritos en el navegador (`localStorage`)? | Define persistencia local vs. sin persistencia en v1 |

**Recomendación provisional:** Todo el procesamiento en el cliente en v1; historial/favoritos solo en `localStorage` con aviso visible; sin envío a servidores.

---

## 4. Herramientas que requieren conexión a BD

Funciones como *buscar Stored Procedures*, *buscar tablas* o *explorar esquemas* normalmente implican conectarse a una base de datos.

| Pregunta | Impacto |
|----------|---------|
| ¿En v1 basta con que el usuario pegue/exporte metadatos (DDL, resultados de `INFORMATION_SCHEMA`, scripts)? | Permite MVP sin backend |
| ¿O se espera conexión en vivo desde el primer release? | Obliga a backend, credenciales y seguridad desde v1 |

**Recomendación provisional:** v1 = herramientas offline (pegado de texto/archivos). Conexión en vivo = v2 con API interna y autenticación.

---

## 5. Idioma y audiencia

| Pregunta | Impacto |
|----------|---------|
| ¿UI solo en español o bilingüe (ES/EN)? | Esfuerzo de i18n desde el inicio |
| ¿Analistas de negocio usarán las mismas herramientas que devs? | Simplifica copy y flujos |

**Recomendación provisional:** Español en v1; estructura de textos preparada para i18n en v2.

---

## 6. Métricas de éxito

| Pregunta | Impacto |
|----------|---------|
| ¿Cómo mediremos éxito (tiempo ahorrado, adopción, encuestas)? | Define si v1 incluye analytics anónimos |
| ¿Hay herramienta concreta que hoy más tiempo consume? | Permite ajustar priorización del MVP |

**Recomendación provisional:** encuesta interna post-MVP + contador anónimo de uso por herramienta (solo local o telemetría opt-in en v1.1).

---

## Cómo cerrar estas decisiones

1. Revisar este documento con Product Owner / Tech Lead.
2. Anotar la decisión y fecha en `03-arquitectura.md` → *Decisiones técnicas iniciales*.
3. Actualizar `02-mvp-roadmap-funcionalidades.md` si cambia el alcance.
4. Eliminar o marcar como resuelta la pregunta en este archivo.
