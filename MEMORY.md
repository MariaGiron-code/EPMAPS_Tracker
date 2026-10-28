# MEMORY.md

Registro de decisiones y hallazgos del proyecto. Lo consulta el agente al iniciar una sesión nueva.

## Estado actual
- Fase: implementación (spec 001 aprobada el 27/10/2026).
- Sistema de diseño: spec `specs/002-diseno-visual/spec.md` aprobada y validada (TD-05 cerrada el 27/10/2026): typecheck y lint pasan, agente `frontend-designer` reporta «cumple» en RF-D-01 a RF-D-05.
- Spec `specs/003-auditoria-funcional/spec.md` clarificada y aprobada (28/10/2026): directorio renombrado (typo corregido), `spec.md` canónico creado. Auditoría de solo lectura; ejecutar con el agente `reviewer`.

## Decisiones tomadas
- ADR-001 a ADR-008 aceptados el 27/10/2026 (ver `docs/adr/`).
- Si no existe lectura anterior, no se calcula consumo ni se activa la advertencia (RF-06).
- Valores propuestos a confirmar: caché de 8 horas (ADR-002) y restricción UNIQUE de medidor y mes (ADR-001).
- D-12 a D-16 (identidad visual): paleta derivada del logo, logo en PNG sin dependencia, glass sin blur, spec 002 propia, tipografía del sistema (ver `specs/002-diseno-visual/decisiones.md`).
- Logo oficial generado en `assets/logo/` desde el SVG fuente: PNG @2x, @1x e ícono 1024×1024.

## Pendientes conocidos
- Confirmar que el APK se instala en el dispositivo del docente o en el emulador Android.
- T-15 y T-16 (lectura anterior, consumo, advertencia y foto obligatoria por consumo anómalo) completados en `app/medidor/[codigo].tsx`: obtiene medidor vía useQuery, calcula consumo, advertencia + confirmación al triple, foto obligatoria si anómalo o dañado. Typecheck y lint pasan (1 warning preexistente en `watch()`). Siguiente: T-17 (reset de enviando).
- Preparar datos de prueba en MockAPI: recursos `medidores` y `lecturas`.
