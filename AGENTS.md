# AGENTS.md

Instrucciones para cualquier agente de IA que trabaje en este repositorio.

## Proyecto
Aplicación móvil para que técnicos de EPMAPS registren lecturas de medidores de agua en campo, incluso sin señal. Prueba I técnica de Desarrollo Móvil (ESFOT-EPN).

## Stack obligatorio
- React Native con **Expo SDK 57** y TypeScript estricto.
- Expo Router para la navegación. Las rutas viven solo en `app/`; los componentes, hooks y servicios van fuera.
- Dependencias: solo las que tengan un ADR en `docs/adr/`. No instales nada sin ADR previo.

## Flujo SDD (obligatorio)
1. Ninguna línea de código se escribe sin una spec aprobada en `specs/<NNN>/spec.md`.
2. Cada tarea de `tasks.md` se implementa en una sesión nueva (`/new`). Cita el RF que cubre.
3. Antes de cerrar una tarea, ejecuta sus criterios de aceptación del `spec.md`.
4. Si una decisión no está en la spec, no la tomes en silencio: pregunta y regístrala en `decisiones.md`.

## Reglas de calidad
- Cada pantalla diseña cuatro estados: cargando, error (con reintento), vacío y pendiente.
- Ningún color, espacio ni radio se escribe a mano: usa `src/constants/theme.ts`.
- La clave del técnico nunca se guarda en texto plano (RF-01, ADR-008).
- Ninguna consulta a MockAPI se hace con un código de medidor inválido (RF-02, ADR-004).

## Prohibido
- Copiar código de otro estudiante o reutilizar su repositorio.
- Editar un ADR aceptado para cambiar la decisión. Se crea uno nuevo que reemplace al anterior.
- Dar por terminada una tarea sin comprobar su criterio de aceptación.

## Comandos útiles
```bash
npx expo start -c        # iniciar y limpiar caché de Metro
npx tsc --noEmit         # verificar tipos
npx expo lint            # revisar estilo
```
Ejecuta typecheck y lint antes de declarar terminada cualquier tarea.
