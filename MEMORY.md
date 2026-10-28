# MEMORY.md

Registro de decisiones y hallazgos del proyecto. Lo consulta el agente al iniciar una sesión nueva.

## Estado actual
- Fase: implementación (spec 001 aprobada el 27/10/2026).
- Sistema de diseño: spec `specs/002-diseno-visual/spec.md` aprobada el 27/10/2026; agente `frontend-designer` y skill `glassmorphism-ui` creados.
- Defensa: miércoles 28/10/2026, 14:00. APK instalado en un dispositivo requerido.
- T-01 (proyecto base) completado: Expo SDK 57.0.31, TypeScript estricto, Expo Router, lint y typecheck pasan. Siguiente tarea: TD-01 (`specs/002-diseno-visual/tasks.md`) (tokens de diseño).

## Decisiones tomadas
- ADR-001 a ADR-008 aceptados el 27/10/2026 (ver `docs/adr/`).
- Si no existe lectura anterior, no se calcula consumo ni se activa la advertencia (RF-06).
- Valores propuestos a confirmar: caché de 8 horas (ADR-002) y restricción UNIQUE de medidor y mes (ADR-001).
- D-12 a D-16 (identidad visual): paleta derivada del logo, logo en PNG sin dependencia, glass sin blur, spec 002 propia, tipografía del sistema (ver `specs/002-diseno-visual/decisiones.md`).
- Logo oficial generado en `assets/logo/` desde el SVG fuente: PNG @2x, @1x e ícono 1024×1024.

## Pendientes conocidos
- Confirmar que el APK se instala en el dispositivo del docente o en el emulador Android.
- Preparar datos de prueba en MockAPI: recursos `medidores` y `lecturas`.
