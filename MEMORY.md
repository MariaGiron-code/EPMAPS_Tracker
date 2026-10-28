# MEMORY.md

Registro de decisiones y hallazgos del proyecto. Lo consulta el agente al iniciar una sesión nueva.

## Estado actual
- Fase: implementación (spec aprobada el 27/10/2026).
- Defensa: miércoles 28/10/2026, 14:00. APK instalado en un dispositivo requerido.
- Siguiente tarea: ver `specs/001-registro-lectura/tasks.md`, primera tarea pendiente.

## Decisiones tomadas
- ADR-001 a ADR-008 aceptados el 27/10/2026 (ver `docs/adr/`).
- Si no existe lectura anterior, no se calcula consumo ni se activa la advertencia (RF-06).
- Valores propuestos a confirmar: caché de 8 horas (ADR-002) y restricción UNIQUE de medidor y mes (ADR-001).

## Pendientes conocidos
- Confirmar que el APK se instala en el dispositivo del docente o en el emulador Android.
- Preparar datos de prueba en MockAPI: recursos `medidores` y `lecturas`.
