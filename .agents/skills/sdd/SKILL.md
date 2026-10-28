---
name: sdd
description: Flujo de Specification-Driven Development para este proyecto. Úsalo al crear, aclarar, planificar, implementar o validar una funcionalidad.
---

# Flujo SDD

Cada funcionalidad sigue estas fases, en orden. No se salta ninguna.

## 1. Decisiones (`grill-me`)
Antes de la spec, entrevista al desarrollador una pregunta a la vez. Registra cada respuesta en `specs/<NNN>/decisiones.md`.

## 2. Especificación (`/sdd-clarify` y luego spec)
- Lee la historia en `docs/historias/HU-<NNN>.md` y `decisiones.md`.
- Escribe `specs/<NNN>/spec.md` con RF numerados y criterios en formato Dado / Cuando / Entonces.
- Pregunta solo por contradicciones o escenarios sin RF. Máximo dos vueltas.
- Cuando el desarrollador apruebe, cambia el estado a `aprobada`.

## 3. Plan (`/sdd-plan`)
- Escribe `specs/<NNN>/plan.md`: dependencias con su ADR, estructura de carpetas, modelo de datos y riesgos.
- No instales dependencias que no estén en un ADR.

## 4. Tareas (`/sdd-tasks`)
- Escribe `specs/<NNN>/tasks.md` con una lista de tareas. Cada una cita los RF que cubre.
- Cada tarea tiene un criterio "Hecho cuando" comprobable.

## 5. Implementación (`/sdd-implement`)
- Una tarea por sesión. Empieza con `/new`.
- Lee `AGENTS.md`, `MEMORY.md` y la tarea. Implementa solo esa tarea.
- Al terminar, comprueba su criterio y marca `[x]` en `tasks.md`.

## 6. Validación (`/sdd-validate`)
- Revisa cada RF contra el código y la app. Lista lo que no cumple.
- Lo que falte vuelve a `tasks.md` como tarea nueva.

## Regla de oro
Si algo no está en la spec, no se programa en silencio. Se pregunta y se registra.
