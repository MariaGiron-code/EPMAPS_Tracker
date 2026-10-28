# Plan técnico — Auditoría funcional (003)

Auditoría de **solo lectura**. No instala dependencias ni modifica código.

## Dependencias y su justificación
Ninguna nueva. Reusa las ya declaradas en `specs/001-registro-lectura/plan.md` (expo-sqlite, TanStack Query, zustand, zod, react-hook-form, expo-image-picker, expo-file-system, NetInfo, expo-secure-store) solo para verificar su presencia y uso. Cada una debe tener un ADR en `docs/adr/` (RNF-05 / AUD-122).

## Estructura de la entrega
- Ejecuta el agente `reviewer` (`.opencode/agents/reviewer.md`) sobre el código actual.
- Entrada: `specs/003-auditoria-fucional/003-auditoria-funcional-spec.md` (criterios AUD-01…AUD-122 y prueba de humo S-01…S-13).
- Salida: informe con la estructura del punto 5 de la spec, guardado en `MEMORY.md` (resultado final) tras corregir los NO CUMPLE.

## Alcance de verificación
1. Pantallas AUD-01 a AUD-06: existencia y alcanzabilidad desde la navegación.
2. Funciones AUD-10 a AUD-122: evidencia en código con archivo:línea.
3. Persistencia: tablas `medidores` y `lecturas` con columnas, tipos y restricciones UNIQUE (AUD-110, AUD-111).
4. Prueba de humo S-01 a S-13: ejecutable solo si el entorno lo permite; si no, marcar NO VERIFICABLE con motivo.

## Riesgos y mitigación
- Entorno sin ejecución de la app → pasos S-xx quedan NO VERIFICABLE; se documenta la razón.
- Falsos positivos por nombre de archivo → el agente debe leer el contenido (regla 3 de la spec).
- Funciones no alcanzables desde navegación → marcar NO CUMPLE aunque existan en código.
- Corrección iterativa: tras el primer informe, corregir NO CUMPLE y re-auditar solo esos identificadores.