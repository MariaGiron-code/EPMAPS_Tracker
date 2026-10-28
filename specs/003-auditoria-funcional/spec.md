# Especificación de auditoría: flujo completo y pantallas

**Estado:** aprobada (28/10/2026)
**Tipo:** auditoría de solo lectura (no modifica código)
**Ejecuta:** agente `reviewer` (`.opencode/agents/reviewer.md`)
**Referencias:** `specs/001-registro-lectura/spec.md` (RF-01 a RF-10, RNF-01 a RNF-05), `specs/001-registro-lectura/plan.md` (rutas y carpetas), `docs/historias/HU-001.md` a `HU-004.md`

## 1. Objetivo

Verificar que la aplicación implementa **todas** las pantallas y funciones necesarias para que el técnico de EPMAPS complete el flujo de principio a fin, sin depender de datos escritos a mano ni de pasos fuera de la app.

Una función cuenta como **existente** solo si:
1. tiene una pantalla o componente que el usuario puede alcanzar desde la navegación, y
2. tiene lógica real conectada a la base de datos, a MockAPI o al estado, no solo texto o botones sin acción.

## 2. Flujo del usuario que se audita

```
[login] → [consulta de medidor (index)] → [registro (medidor/[codigo])]
                                                 │
                     ┌───────────────────────────┼───────────────────────┐
                     ▼                           ▼                       ▼
              borrador (continuar/        advertencia de consumo      foto (si es obligatoria)
              descartar al reabrir)       y confirmación
                                                 │
                                                 ▼
                                    [guardar como pendiente]
                                                 │
                                                 ▼
                              [pendientes (pendientes.tsx)]
                              editar · enviar · ver contador
                                                 │
                                                 ▼
                                    [envío automático al volver la señal]
```

Restricción transversal: en **todas** las pantallas deben verse el estado de conexión y el número de lecturas pendientes (RF-09).

## 3. Criterios de auditoría

Cada criterio tiene un identificador. El agente debe marcarlo **CUMPLE**, **NO CUMPLE** o **NO VERIFICABLE**, y citar el archivo y la línea donde encontró la evidencia.

### 3.1 Pantallas (interfaces) requeridas

| ID | Pantalla | Archivo esperado | Debe existir y ser alcanzable desde |
|---|---|---|---|
| AUD-01 | Login | `app/login.tsx` | Arranque de la app, cuando no hay sesión |
| AUD-02 | Consulta de medidor | `app/index.tsx` | Tras iniciar sesión (pantalla principal) |
| AUD-03 | Registro de lectura | `app/medidor/[codigo].tsx` | Desde el resultado de la consulta |
| AUD-04 | Lecturas pendientes | `app/pendientes.tsx` | Desde la navegación principal, con acceso siempre visible |
| AUD-05 | Cierre de sesión | Acción dentro de la app | Visible desde la pantalla principal |
| AUD-06 | Barra de conexión y contador | Componente en `src/components/` usado en el layout | Presente en AUD-01 a AUD-04 |

### 3.2 Funciones por requisito

**R1 · Sesión (RF-01)**
- AUD-10: el login valida código de empleado y clave contra datos definidos, y entra a la pantalla principal.
- AUD-11: la sesión se guarda y sobrevive al cierre de la app.
- AUD-12: la clave no se guarda en texto plano (usa `expo-secure-store`, ADR-008; RNF-03).
- AUD-13: cerrar sesión borra la sesión guardada y vuelve al login.

**R2 · Código del medidor (RF-02)**
- AUD-20: el campo acepta solo `MED-` seguido de seis dígitos, validado con zod (ADR-004).
- AUD-21: un código inválido muestra un error visible y **no** llama a la red.
- AUD-22: un código válido dispara una sola consulta.

**R3 · Consulta y caché (RF-03)**
- AUD-30: la consulta muestra dirección, sector, cuenta, estado, última lectura con fecha y consumo promedio.
- AUD-31: si el medidor ya se consultó, se muestra desde caché sin señal y sin error (TanStack Query, `staleTime` de 8 h, ADR-002).
- AUD-32: si el medidor no existe, se muestra un mensaje claro y no se rompe la pantalla.

**R4 · Registro sin señal (RF-04)**
- AUD-40: el formulario de registro se puede completar sin conexión.
- AUD-41: la lectura guardada sin señal queda con estado `pendiente de verificar` y muestra la lectura anterior como referencia.
- AUD-42: al recuperar señal, se compara con la lectura anterior y el estado cambia según el resultado.

**R5 · Estados del medidor (RF-05)**
- AUD-50: existen los tres estados: normal, inaccesible, dañado.
- AUD-51: con "normal", la lectura es obligatoria.
- AUD-52: con "inaccesible", el motivo es obligatorio y el campo de lectura no permite guardar un valor.
- AUD-53: con "dañado", la descripción es obligatoria y la lectura es opcional.

**R6 · Consumo y advertencia (RF-06)**
- AUD-60: el consumo se calcula como lectura actual menos la anterior.
- AUD-61: si el consumo supera el triple del promedio, aparece una advertencia.
- AUD-62: la advertencia exige una confirmación explícita antes de guardar.
- AUD-63: si no hay lectura anterior, no se calcula el consumo ni aparece la advertencia.

**R7 · Foto (RF-07)**
- AUD-70: la foto es obligatoria con consumo anómalo o medidor dañado, y opcional en los demás casos.
- AUD-71: la foto se copia a un directorio persistente (ADR-006), no a la caché temporal.
- AUD-72: si el permiso de cámara está denegado y la foto es obligatoria, la app explica por qué y no guarda.
- AUD-73: si el permiso está denegado y la foto es opcional, el usuario puede continuar.

**R8 · Registro en varios pasos (RF-08)**
- AUD-80: el borrador se guarda en cada paso (Zustand con persistencia, ADR-003).
- AUD-81: al abrir la app con un borrador, se ofrece continuar o descartar.
- AUD-82: al elegir continuar, los datos ya ingresados aparecen en el formulario.

**R9 · Envío automático (RF-09)**
- AUD-90: la app detecta la conexión real con NetInfo (ADR-007).
- AUD-91: al recuperar señal, las lecturas pendientes se envían sin que el usuario haga nada.
- AUD-92: antes de enviar, se consulta MockAPI por `uuid`; si ya existe, no se crea otra (idempotencia).
- AUD-93: al iniciar la app, las lecturas en `enviando` vuelven a `pendiente`.
- AUD-94: el número de pendientes se actualiza en la barra de conexión.

**R10 · Corrección y unicidad (RF-10)**
- AUD-100: una lectura `pendiente` se puede editar y los cambios se guardan.
- AUD-101: una lectura `enviada` no ofrece la acción de editar.
- AUD-102: si ya existe lectura para el mismo medidor y mes, se rechaza el registro con un mensaje (restricción UNIQUE en SQLite).

**Persistencia (ADR-001)**
- AUD-110: existen las tablas `medidores` y `lecturas` con las columnas y tipos del plan.
- AUD-111: `lecturas` tiene `UNIQUE(uuid)` y `UNIQUE(codigo_medidor, mes)`.

**Calidad transversal**
- AUD-120 (RNF-01): ninguna pantalla de registro llama a la red para guardar.
- AUD-121 (RNF-04): los botones miden al menos 44 px y los estados no dependen solo del color.
- AUD-122 (RNF-05): TypeScript está en modo estricto y cada dependencia de `package.json` tiene un ADR que la cite.

## 4. Verificación del recorrido (prueba de humo manual)

Además de leer el código, el agente debe comprobar que el recorrido es posible. Si el entorno no permite ejecutar la app, marca estos pasos como **NO VERIFICABLE** y deja la razón.

| Paso | Acción | Resultado esperado |
|---|---|---|
| S-01 | Abrir la app sin sesión | Aparece el login |
| S-02 | Iniciar sesión con datos válidos | Aparece la consulta |
| S-03 | Escribir `MED-000001` y consultar | Se muestran los datos del medidor |
| S-04 | Escribir `123` | Error y ninguna petición |
| S-05 | Abrir el registro, elegir "normal", guardar sin lectura | Se bloquea con mensaje |
| S-06 | Elegir "dañado" sin descripción | Se bloquea con mensaje |
| S-07 | Registrar con consumo mayor al triple | Aparece la advertencia y pide confirmación |
| S-08 | Cerrar la app a mitad de un registro y reabrirla | Se ofrece continuar o descartar |
| S-09 | Guardar una lectura sin señal | Queda en `pendiente` |
| S-10 | Entrar a pendientes y editar una lectura pendiente | Se guarda el cambio |
| S-11 | Registrar otra lectura del mismo medidor y mes | Se rechaza con mensaje |
| S-12 | Recuperar la señal | Las pendientes pasan a `enviada` sin acción manual |
| S-13 | Cerrar sesión | Vuelve al login |

## 5. Formato del informe

El agente entrega un informe con esta estructura:

```
# Informe de auditoría funcional

Resumen: X cumplen · Y no cumplen · Z no verificables

## No cumple (prioridad alta)
- AUD-xx · descripción · evidencia: archivo:línea · acción sugerida

## No verificable
- AUD-xx · motivo

## Cumple
- AUD-xx (lista corta)

## Pantallas faltantes
- (lista de AUD-01 a AUD-06 que no existan)
```

## 6. Reglas para el agente

1. Solo lee y reporta. No edita archivos ni instala dependencias.
2. Cita evidencia concreta para cada veredicto. Un "parece que existe" no cuenta.
3. No marca **CUMPLE** por nombre de archivo. Debe leer el contenido.
4. Si una función está en el código pero no es alcanzable desde la navegación, marca **NO CUMPLE** y explica el motivo.
5. Reporta los hallazgos con el identificador del criterio, para que el equipo los corrija en orden.

## 7. Cómo ejecutar

1. Revisar y aprobar esta spec.
2. Abrir el repositorio de la prueba en OpenCode.
3. Ejecutar el agente `reviewer` con la instrucción: "Ejecuta la auditoría de `specs/003-auditoria-funcional/spec.md` sobre el código actual y entrega el informe del punto 5."
4. Corregir los **NO CUMPLE** y volver a auditar solo esos identificadores.
5. Registrar el resultado final en `MEMORY.md`.
