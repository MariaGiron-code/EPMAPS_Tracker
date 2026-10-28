# ADR-003: Usar Zustand con persistencia para el estado compartido entre pantallas

## Estado
Aceptado.

## Fecha
27/10/2026

## Requisitos relacionados
R8 (recuperar el registro a medias al reabrir la app), R9 (mostrar el estado de conexión y el número de lecturas pendientes en todas las pantallas).

## Contexto
El registro de una lectura ocupa varias pantallas, y cada una necesita los datos de las anteriores. Además, la barra de estado de conexión y el contador de pendientes deben verse en todas las pantallas. Si la app se cierra a mitad del registro, el borrador debe poder recuperarse.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
|---|---|---|
| Zustand con middleware `persist` | Un almacén pequeño y global. El middleware guarda el borrador automáticamente. Cualquier pantalla lee la conexión y los pendientes sin pasar datos por parámetros. | Es una dependencia más. Un almacén global puede crecer si no se limita su contenido. |
| Context de React | No añade dependencias. | No persiste los datos. Cada cambio vuelve a renderizar todo el árbol que depende del contexto. |
| Solo SQLite | Todo está guardado en un solo lugar. | La interfaz no se actualiza sola cuando cambian la conexión o los pendientes. Habría que consultar la base de datos en cada pantalla. |

## Decisión
Se usa Zustand. El almacén tiene solo tres piezas: el estado de conexión, el contador de pendientes y el borrador del registro en curso, que se persiste con AsyncStorage (ver ADR-002). Las lecturas confirmadas siguen en SQLite (ADR-001).

## Consecuencias
- Gana: la conexión y los pendientes se actualizan en todas las pantallas, y el borrador sobrevive al cierre de la app.
- Pierde: una dependencia más que justificar, y la disciplina de no guardar en el almacén datos que pertenecen a SQLite.
- Riesgo: si el contador de pendientes y SQLite se desfasan, el técnico verá un número incorrecto. Por eso el contador se recalcula desde SQLite al abrir la app.

## Verificación
- Revisar el archivo del almacén y confirmar que solo contiene conexión, pendientes y borrador.
- En el teléfono: con una lectura pendiente, comprobar que el contador aparece igual en las dos pestañas. Cerrar la app durante un registro, reabrirla y comprobar que se ofrece continuar o descartar.

## Uso de IA
Consulté a la IA si el estado global podía resolverse con Context. Me indicó que Context no persiste los datos y provoca renderizados innecesarios, lo que me llevó a elegir Zustand. Descarté guardar las lecturas en el almacén, porque la fuente de verdad debe ser SQLite.
