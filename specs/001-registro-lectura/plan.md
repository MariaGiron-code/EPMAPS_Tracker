# Plan técnico

Traduce la spec en decisiones de implementación. Cada dependencia cita su ADR.

## Dependencias y su justificación

| Paquete | ADR | RF que cubre |
|---|---|---|
| expo-sqlite | ADR-001 | RF-04, RF-08, RF-10 |
| @tanstack/react-query | ADR-002 | RF-03 |
| @react-native-async-storage/async-storage | ADR-002 (persister), ADR-003 (borrador) | RF-03, RF-08 |
| zustand | ADR-003 | RF-08, RF-09 |
| zod | ADR-004 | RF-02, RF-05, RF-06 |
| react-hook-form y @hookform/resolvers | ADR-005 | RF-05, RF-06, RF-10 |
| expo-image-picker | ADR-006 | RF-07 |
| expo-file-system | ADR-006 | RF-07 |
| @react-native-community/netinfo | ADR-007 | RF-09 |
| expo-secure-store | ADR-008 | RF-01 |

## Estructura de carpetas

```
app/                    rutas de Expo Router (solo pantallas y layouts)
  _layout.tsx           proveedores y Stack
  login.tsx             RF-01
  index.tsx             RF-02, RF-03: consulta de medidor
  medidor/[codigo].tsx  RF-04 a RF-07: registro de lectura
  pendientes.tsx        RF-09, RF-10
src/
  db/                   esquema SQLite y consultas (ADR-001)
  api/                  cliente y funciones de MockAPI
  cache/                configuración de TanStack Query y persister (ADR-002)
  store/                Zustand: conexión, pendientes, borrador (ADR-003)
  schemas/              esquemas zod (ADR-004)
  sync/                 cola de envío y comprobación previa (ADR-007)
  components/           piezas visuales reutilizables
  constants/theme.ts    tokens de diseño
```

## Modelo de datos (SQLite)

- `medidores(codigo PRIMARY KEY, direccion, sector, cuenta, estado, ultima_lectura, fecha_ultima, consumo_promedio)`
- `lecturas(id PRIMARY KEY, uuid UNIQUE, codigo_medidor, mes, lectura, estado_medidor, motivo, descripcion_dano, foto_ruta, estado_envio, creado_en, UNIQUE(codigo_medidor, mes))`
- `estado_envio`: `pendiente`, `enviando`, `enviada`.

## Flujo de envío (ADR-007)
1. Al detectar conexión real, se toma la siguiente lectura `pendiente` y pasa a `enviando`.
2. Antes del `POST`, se consulta MockAPI por `uuid`. Si existe, se marca `enviada` sin crear otra.
3. Si no existe, se envía. Al recibir respuesta, pasa a `enviada`.
4. Al iniciar la app, las lecturas en `enviando` vuelven a `pendiente` y se reintentan con el mismo `uuid`.

## Riesgos y mitigación
- Duplicados en MockAPI → comprobación previa por `uuid` (tarea T-11).
- Fotos perdidas → copia en directorio persistente, borrado solo tras envío confirmado (T-08).
- Esquema que cambia durante la prueba → esquema fijado en T-02 antes de las pantallas.
