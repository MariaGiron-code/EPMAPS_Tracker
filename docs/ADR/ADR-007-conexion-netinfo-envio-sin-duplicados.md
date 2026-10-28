# ADR-007: Detectar la conexión con NetInfo y enviar las lecturas sin duplicarlas

## Estado
Aceptado.

## Fecha
27/10/2026

## Requisitos relacionados
R4 (una lectura sin señal queda pendiente de verificar y se compara con la anterior al recuperar la conexión), R9 (envío automático al recuperar la conexión, sin duplicados aunque la señal se corte durante el envío), R10 (una lectura pendiente puede corregirse; una enviada no).

## Contexto
La app necesita saber cuándo hay conexión para enviar las lecturas pendientes. En el deber comprobamos que `expo-network` no detecta la pérdida total de red en Android. Además, la señal puede cortarse después de que MockAPI recibe una lectura pero antes de que la app reciba la respuesta. En ese caso la app creería que el envío falló y lo repetiría, lo que generaría un duplicado.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
|---|---|---|
| NetInfo + envío al recuperar la red | Detecta cambios nativos de red en Android e iOS. Ya lo usamos en el deber, con comprobación real de internet. | Es una dependencia más. "Conectado" no siempre significa internet, así que hay que confirmar con una petición. |
| expo-network | Ya viene con Expo y no añade dependencias. | No detecta la pérdida total de red en Android, como comprobamos en el deber. |
| expo-background-task | Enviaría aunque la app esté cerrada. | El sistema decide cuándo se ejecuta, así que no es confiable para la demostración del miércoles. |

## Decisión
Se usa NetInfo para detectar cambios de conexión, y se confirma con una petición real antes de enviar. Cada lectura recibe un identificador único al registrarse y ese identificador viaja en el envío. Antes de reenviar una lectura que quedó en estado "enviando", la app consulta MockAPI para ver si ya existe una lectura con ese identificador. Si existe, la marca como enviada sin volver a crearla.

## Consecuencias
- Gana: el envío no se duplica aunque la señal se corte después de que el servidor guardó la lectura.
- Pierde: cada reintento hace una consulta adicional.
- Riesgo: si la app se cierra durante un envío, la lectura queda en "enviando" hasta la siguiente apertura. Ese es el costo de no usar un proceso en segundo plano.
- Obligación: MockAPI no impone unicidad, así que la comprobación de identificadores la hace la app.

## Verificación
- Revisar que cada lectura tiene un identificador único y que la comprobación previa existe antes del `POST`.
- En el teléfono: enviar una lectura pendiente y activar el modo avión durante el envío. Al volver la red, MockAPI debe tener una sola lectura con ese identificador.
- Confirmar que el indicador de pendientes baja a cero cuando todas se envían.

## Uso de IA
Consulté a la IA si el envío podía hacerse en segundo plano con expo-background-task. Me advirtió que el sistema decide cuándo se ejecuta y que Android lo limita, así que lo descarté para la demostración. Acepté usar NetInfo, que ya conozco del deber, y la comprobación previa por identificador, que evita el duplicado.
