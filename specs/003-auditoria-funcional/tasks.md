# Tareas — Auditoría funcional (003)

Auditoría de solo lectura. Cada tarea cita los criterios AUD que cubre.

- [x] T-01 · Verificar pantallas requeridas (AUD-01 a AUD-06)
  - Hecho cuando: se confirma existencia y alcanzabilidad de login, index, medidor/[codigo], pendientes, cierre de sesión y barra de conexión/contador; se listan las faltantes.

- [x] T-02 · Auditar sesión (AUD-10 a AUD-13)
  - Hecho cuando: evidencia de validación de credenciales, persistencia de sesión, uso de expo-secure-store y borrado al cerrar sesión.

- [x] T-03 · Auditar código del medidor (AUD-20 a AUD-22)
  - Hecho cuando: validación zod `MED-` + 6 dígitos, error visible sin red, una sola consulta por código válido.

- [x] T-04 · Auditar consulta y caché (AUD-30 a AUD-32)
  - Hecho cuando: se muestran todos los campos, caché con staleTime 8h, mensaje claro si no existe.

- [x] T-05 · Auditar registro sin señal (AUD-40 a AUD-42)
  - Hecho cuando: formulario completo offline, estado `pendiente de verificar`, comparación al recuperar señal.

- [x] T-06 · Auditar estados del medidor (AUD-50 a AUD-53)
  - Hecho cuando: tres estados, lectura obligatoria en normal, motivo en inaccesible, descripción en dañado.

- [x] T-07 · Auditar consumo y advertencia (AUD-60 a AUD-63)
  - Hecho cuando: cálculo consumo, advertencia al triple, confirmación explícita, sin advertencia si no hay lectura anterior.

- [x] T-08 · Auditar foto (AUD-70 a AUD-73)
  - Hecho cuando: obligatoriedad condicional, copia a directorio persistente, manejo de permiso denegado.

- [x] T-09 · Auditar registro en varios pasos (AUD-80 a AUD-82)
  - Hecho cuando: borrador persistente, oferta continuar/descartar, datos recuperados.

- [x] T-10 · Auditar envío automático (AUD-90 a AUD-94)
  - Hecho cuando: NetInfo, envío sin acción, idempotencia por uuid, reset de `enviando`, contador actualizado.

- [x] T-11 · Auditar corrección y unicidad (AUD-100 a AUD-102)
  - Hecho cuando: edición de pendientes, sin edición de enviadas, rechazo por UNIQUE.

- [x] T-12 · Auditar persistencia y calidad transversal (AUD-110 a AUD-122)
  - Hecho cuando: tablas y restricciones, sin red al guardar, botones ≥44px, TS estricto y ADR por dependencia.

- [x] T-13 · Ejecutar prueba de humo (S-01 a S-13) y generar informe
  - Hecho cuando: informe con formato del punto 5 entregado y resultado registrado en MEMORY.md.