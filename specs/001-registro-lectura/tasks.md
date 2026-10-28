# Tareas

Cada tarea se hace en una sesión nueva (`/new`). Marca `[x]` solo cuando su criterio de aceptación se cumple.

- [ ] **T-01 · Proyecto base.** Crear el proyecto con Expo SDK 57 y TypeScript estricto. Commit de ADR y spec primero.
  - Hecho cuando: `npx expo start` funciona y `docs/adr/` ya está en el historial antes de instalar dependencias.

- [ ] **T-02 · Esquema SQLite.** Crear tablas `medidores` y `lecturas` con la restricción `UNIQUE(codigo_medidor, mes)`. (RF-10, ADR-001)
  - Hecho cuando: insertar dos lecturas del mismo medidor en el mismo mes falla en la base de datos.

- [ ] **T-03 · Esquemas zod.** Código del medidor (`MED-` + seis dígitos) y reglas por estado. (RF-02, RF-05, RF-06, ADR-004)
  - Hecho cuando: `MED-12345` y `med-123456` se rechazan, y una lectura "inaccesible" sin motivo no pasa la validación.

- [ ] **T-04 · Cliente MockAPI y caché.** Configurar TanStack Query con `staleTime` de 8 horas y persister en AsyncStorage. (RF-03, ADR-002)
  - Hecho cuando: una segunda consulta del mismo medidor con modo avión muestra los datos.

- [ ] **T-05 · Sesión.** Pantalla de login con datos quemados y guardado en SecureStore. (RF-01, ADR-008)
  - Hecho cuando: el técnico sigue identificado al reiniciar la app, y cerrar sesión pide código y clave otra vez.

- [ ] **T-06 · Consulta de medidor.** Pantalla de búsqueda con validación y los siete datos. (RF-02, RF-03)
  - Hecho cuando: un código incompleto muestra error sin petición, y un código válido muestra los datos.

- [ ] **T-07 · Formulario de lectura.** Estados normal, inaccesible y dañado con react-hook-form. (RF-05, RF-06, ADR-005)
  - Hecho cuando: cada estado exige sus campos y el campo oculto se limpia al cambiar de estado.

- [ ] **T-08 · Foto.** Captura, copia persistente y permiso denegado con explicación. (RF-07, ADR-006)
  - Hecho cuando: la foto sobrevive a un reinicio y la denegación muestra el motivo.

- [ ] **T-09 · Borrador y recuperación.** Guardar cada paso en Zustand persistido y ofrecer continuar o descartar. (RF-08, ADR-003)
  - Hecho cuando: cerrar la app a mitad del registro y reabrirla ofrece continuar con los datos ingresados.

- [ ] **T-10 · Lectura sin señal y pendientes.** Guardar en SQLite con estado `pendiente`, permitir corregirla y bloquear la edición de enviadas. (RF-04, RF-10)
  - Hecho cuando: en modo avión se registra una lectura, se puede corregir, y una enviada ya no admite cambios.

- [ ] **T-11 · Envío sin duplicados.** Cola con `uuid`, comprobación previa en MockAPI y envío al recuperar red. Indicador de conexión y pendientes en todas las pantallas. (RF-09, ADR-007)
  - Hecho cuando: cortar la señal durante un envío deja una sola lectura en MockAPI.

- [ ] **T-12 · Verificación final.** Ejecutar `sdd-validate` contra la spec, revisión del `reviewer` sobre ADR-007 y ADR-008, y generar el APK.
  - Hecho cuando: todos los RF tienen su criterio comprobado y el APK se instala en el dispositivo.
