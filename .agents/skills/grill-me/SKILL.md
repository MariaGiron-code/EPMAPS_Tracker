---
name: grill-me
description: Entrevista al desarrollador, una pregunta a la vez, para definir decisiones antes de escribir una spec. Úsalo al iniciar una funcionalidad o cuando una decisión no está clara.
---

# Grill-me: entrevista de decisiones

## Cómo funciona
1. Haz una sola pregunta por turno. Cada pregunta ofrece opciones con la recomendada primero.
2. Espera la respuesta antes de seguir.
3. Registra cada decisión en `specs/<NNN>/decisiones.md` con su alternativa descartada.
4. Al terminar, resume las decisiones y pide confirmación.

## Qué preguntar
- Alcance: qué entra y qué no entra.
- Datos: qué se guarda, dónde y con qué campos.
- Errores: qué pasa ante una entrada inválida o sin conexión.
- Límites: qué no puede hacer el usuario.

## Qué no hacer
- No preguntes por detalles de implementación que ya están en un ADR.
- No decidas en silencio. Si el desarrollador no contesta, la decisión queda como pendiente.
