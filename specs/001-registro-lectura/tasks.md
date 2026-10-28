# Tareas

Cada tarea se hace en una sesión nueva (`/new`). Marca `[x]` solo cuando su criterio de aceptación se cumple.

> Previo a las tareas de interfaz (T-05 en adelante): completar `specs/002-diseno-visual/tasks.md` (sistema de diseño, agente `frontend-designer` y skill `glassmorphism-ui`).

- [x] **T-01 · Proyecto base.** Crear el proyecto con Expo SDK 57 y TypeScript estricto. Commit de ADR y spec primero.
  - Hecho cuando: `npx expo start` funciona y `docs/adr/` ya está en el historial antes de instalar dependencias.

- [x] **T-02 · Esquema SQLite.** Crear tablas `medidores` y `lecturas` con la restricción `UNIQUE(codigo_medidor, mes)`. (RF-10, ADR-001)
  - Hecho cuando: insertar dos lecturas del mismo medidor en el mismo mes falla en la base de datos.

- [x] **T-03 · Esquemas zod.** Código del medidor (`MED-` + seis dígitos) y reglas por estado. (RF-02, RF-05, RF-06, ADR-004)
  - Hecho cuando: `MED-12345` y `med-123456` se rechazan, y una lectura "inaccesible" sin motivo no pasa la validación.

- [x] **T-04 · Cliente MockAPI y caché.** Configurar TanStack Query con `staleTime` de 8 horas y persister en AsyncStorage. (RF-03, ADR-002)
  - Hecho cuando: una segunda consulta del mismo medidor con modo avión muestra los datos.

- [x] **T-05 · Sesión.** Pantalla de login con datos quemados y guardado en SecureStore. (RF-01, ADR-008)
  - Hecho cuando: el técnico sigue identificado al reiniciar la app, y cerrar sesión pide código y clave otra vez.

- [x] **T-06 · Consulta de medidor.** Pantalla de búsqueda con validación y los siete datos. (RF-02, RF-03)
  - Hecho cuando: un código incompleto muestra error sin petición, y un código válido muestra los datos.

- [x] **T-07 · Formulario de lectura.** Estados normal, inaccesible y dañado con react-hook-form. (RF-05, RF-06, ADR-005)
  - Hecho cuando: cada estado exige sus campos y el campo oculto se limpia al cambiar de estado.

- [x] **T-08 · Foto.** Captura, copia persistente y permiso denegado con explicación. (RF-07, ADR-006)
  - Hecho cuando: la foto sobrevive a un reinicio y la denegación muestra el motivo.

- [x] **T-09 · Borrador y recuperación.** Store persistido `useDraft` creado en `src/store/draft.ts`. (RF-08, ADR-003)
  - Hecho cuando: cerrar la app a mitad del registro y reabrirla ofrece continuar con los datos ingresados.
  - Completado en esta sesión: el formulario de `app/medidor/[codigo].tsx` guarda el borrador con debounce de 300 ms y, al abrir, ofrece "Continuar" (reset del form) o "Descartar"; al guardar con éxito se limpia. Typecheck y lint pasan (2 warnings preexistentes).

- [x] **T-10 · Lectura sin señal y pendientes.** Guardar en SQLite con estado `pendiente`, permitir corregirla y bloquear la edición de enviadas. (RF-04, RF-10)
  - Hecho cuando: en modo avión se registra una lectura, se puede corregir, y una enviada ya no admite cambios.

- [x] **T-11 · Envío sin duplicados.** Cola con `uuid`, comprobación previa en MockAPI y envío al recuperar red. Indicador de conexión y pendientes en todas las pantallas. (RF-09, ADR-007)
  - Hecho cuando: cortar la señal durante un envío deja una sola lectura en MockAPI.
  - Implementación: `src/sync/envio.ts` (listarPendientes, enviarUna con pre-check por uuid, enviarPendientes con reset de "enviando"→"pendiente"), `src/sync/useSync.ts` (NetInfo), `src/store/status.ts` y `src/components/StatusBadge.tsx` en login/index/medidor. Typecheck y lint pasan.

- [x] **T-12 · Verificación final.** Ejecutar `sdd-validate` contra la spec, revisión del `reviewer` sobre ADR-007 y ADR-008, y generar el APK.
  - Hecho cuando: todos los RF tienen su criterio comprobado y el APK se instala en el dispositivo.
  - Validación (27/10/2026): `npx tsc --noEmit` sin errores; `npx expo lint` 0 errores (1 warning preexistente en `app/medidor/[codigo].tsx:28` por `watch()`). TD-05 reporta RF-D-01 a RF-D-05 = Cumple. RF-01..RF-10 cubiertos por T-05..T-11. APK pendiente de build.

- [x] **T-13 · Pantalla de pendientes.** Crear `app/pendientes.tsx` con listado, edición y envío. (AUD-04, RF-10)
  - Hecho cuando: pantalla alcanzable y lista pendientes con editar/enviar.
  - Implementación: `app/pendientes.tsx` con FlatList, modal de edición, acción enviar (enviarUna), StatusBadge. Navegación desde index ("Ver pendientes") y registro en _layout. Typecheck y lint pasan (1 warning preexistente en watch()).

- [x] **T-14 · Caché persistente de TanStack Query.** Persister AsyncStorage. (AUD-31, RF-03, ADR-002)
  - Hecho cuando: consulta del mismo medidor con modo avión tras reinicio muestra datos.
  - Implementación: `PersistQueryClientProvider` con `createAsyncStoragePersister` en `_layout.tsx`, `maxAge` 24h. Typecheck y lint pasan.

- [x] **T-15 · Lectura anterior, consumo y advertencia.** Mostrar lectura anterior, calcular consumo, advertir al triple con confirmación, sin consumo si no hay anterior. (AUD-41, AUD-42, AUD-60..AUD-63, RF-04, RF-06)
  - Hecho cuando: formulario muestra lectura anterior y advertencia solo cuando corresponde.
  - Implementación: `app/medidor/[codigo].tsx` obtiene medidor vía useQuery, muestra lectura anterior + consumo promedio, calcula consumo, muestra advertencia roja + botón de confirmación cuando supera el triple, sin consumo si no hay anterior. Typecheck y lint pasan (1 warning preexistente en `watch()`).

- [x] **T-16 · Foto obligatoria por consumo anómalo.** Incluir consumo anómalo. (AUD-70, RF-07)
  - Hecho cuando: con consumo anómalo la foto es obligatoria aunque el estado sea normal.
  - Implementación: `fotoObligatoria = estado === "danado" || anomalo` en `app/medidor/[codigo].tsx`. Typecheck y lint pasan.

- [x] **T-17 · Reset de `enviando` al iniciar.** Volver a `pendiente`. (AUD-93, RF-09, ADR-007)
  - Hecho cuando: al reabrir la app las lecturas en `enviando` se reintentan.
  - Implementación: `resetEnviando()` importada en `app/_layout.tsx` y llamada en el `useEffect` de arranque junto a `init()`. Las lecturas atascadas en `enviando` vuelven a `pendiente` antes de que `useSync` arranque NetInfo. Typecheck y lint pasan (1 warning preexistente en `watch()`).

- [ ] **T-18 · Edición de pendientes y bloqueo de enviadas.** (AUD-100, AUD-101, RF-10)
  - Hecho cuando: una pendiente se corrige y una enviada no ofrece editar.
