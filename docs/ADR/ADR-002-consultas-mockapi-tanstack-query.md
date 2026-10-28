# ADR-002: Consultar MockAPI con TanStack Query y persistir su caché

## Estado
Aceptado.

## Fecha
27/10/2026

## Requisitos relacionados
R3 (con señal se muestran los datos del medidor, y una segunda consulta durante la jornada usa la caché), R9 (las consultas siguen funcionando al recuperar la conexión).

## Contexto
El técnico consulta un mismo medidor varias veces durante la jornada, y en zonas rurales la conexión se pierde a mitad de una consulta. La app necesita decidir cuándo volver a pedir un dato, mostrar estados de carga y error, y conservar la última respuesta válida incluso después de cerrar la app. La decisión de cuándo pedir de nuevo es distinta para medidores y para lecturas enviadas.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
|---|---|---|
| TanStack Query | Ya lo conocemos del deber. `staleTime` define cuánto dura un dato sin volver a pedirse. Maneja carga, error y reintentos sin código adicional. Permite persistir la caché. | Es una dependencia más. La persistencia necesita un "persister", que en este caso es AsyncStorage y hay que justificarlo en este ADR. |
| Tabla de caché en SQLite | Todo queda en una sola base de datos. | La expiración, la invalidación y los estados de carga y error hay que programarlos a mano. |
| `fetch` sin caché | No añade dependencias. | No cumple R3: cada consulta vuelve a descargar el medidor. |

## Decisión
Se usa TanStack Query para las consultas a MockAPI. La caché de consultas se persiste en AsyncStorage con un `staleTime` de 8 horas, que corresponde a una jornada de trabajo. Las lecturas no se guardan en esta caché: viven en SQLite (ADR-001), porque la caché puede descartarse y las lecturas no.

## Consecuencias
- Gana: estados de carga, error y reintento, además de la caché, sin escribir esa lógica.
- Pierde: hay dos mecanismos de almacenamiento (SQLite y AsyncStorage). Hay que explicar la diferencia en la defensa.
- Riesgo: si la oficina cambia un dato del medidor, el técnico verá el valor anterior hasta que pasen 8 horas o hasta que lo actualice manualmente.

## Verificación
- Revisar la configuración de `QueryClient` y confirmar `staleTime` de 8 horas para medidores.
- En el teléfono: consultar un medidor con señal, activar el modo avión, cerrar la app, abrirla y consultar el mismo medidor. Debe mostrarse sin error.

## Uso de IA
Consulté a la IA si conviene usar TanStack Query o una tabla de caché propia. Me recomendó TanStack Query porque ya conozco su funcionamiento y evita programar la expiración a mano. Acepté la recomendación. El valor de 8 horas lo elegí yo por la duración de la jornada.
