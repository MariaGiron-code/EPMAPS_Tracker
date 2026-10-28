# ADR-001: Usar expo-sqlite como almacenamiento local de lecturas, fotos y cola de envío

## Estado
Aceptado.

## Fecha
27/10/2026

## Requisitos relacionados
R3 (caché de consultas), R4 (lecturas sin señal), R8 (recuperar un registro a medias), R9 (envío sin duplicar), R10 (corrección de pendientes y una lectura por medidor al mes).

## Contexto
El técnico registra lecturas en zonas sin señal y puede cerrar la aplicación a mitad de un registro. Cada lectura tiene datos relacionados: pertenece a un medidor, a un mes y a un estado (pendiente, enviando o enviada). Además, la aplicación debe poder comprobar, antes de guardar, que no existe ya una lectura del mismo medidor en el mismo mes. La ruta de la foto también debe sobrevivir a reinicios. Ningún paso del registro puede depender de la conexión.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
|---|---|---|
| expo-sqlite | Consultas SQL para buscar pendientes y comprobar la restricción mensual. Las transacciones evitan que un corte deje una lectura a medias. La restricción UNIQUE (medidor, mes) la hace la base de datos, no el código de la pantalla. | Hay que escribir el esquema y las migraciones. Se añade una dependencia nativa que debe justificarse. |
| AsyncStorage | Ya lo usamos en el deber, así que no hay nada nuevo que aprender. | Solo guarda pares clave-valor. Para encontrar pendientes hay que leer todo y filtrar. No hay transacciones: un corte a mitad de una escritura puede dejar datos incompletos. |
| Archivos JSON con expo-file-system | No necesita base de datos. El contenido es legible al revisarlo. | No tiene índices ni transacciones. La restricción mensual y la cola de envío habría que programarlas a mano, y serían frágiles. |

## Decisión
Se usa expo-sqlite. La restricción de R10 y la cola de R9 son consultas sobre datos relacionados, y las transacciones garantizan que una lectura nunca quede en un estado intermedio.

## Consecuencias
- Gana: integridad de los datos sin conexión y consultas simples para pendientes y duplicados.
- Pierde: complejidad inicial. Hay que mantener el esquema y las migraciones.
- Riesgo: un error en el esquema obliga a reinstalar el APK. Por eso el esquema se fija antes de programar las pantallas.
- Obligación: las fotos no se guardan dentro de SQLite; solo se guarda su ruta local.

## Verificación
- Revisar el archivo del esquema y confirmar la restricción UNIQUE sobre medidor y mes en la tabla de lecturas.
- En el teléfono: registrar una lectura en modo avión, cerrar la app, volver a abrirla y comprobar que la lectura sigue como pendiente.
- Intentar un segundo registro del mismo medidor en el mismo mes y comprobar que se rechaza.

## Uso de IA
Consulté a la IA si AsyncStorage bastaba para este caso. Me recomendó SQLite por la restricción mensual, lo que coincide con la decisión final. Descarté su propuesta de guardar el borrador del registro solo en memoria, porque R8 exige recuperarlo después de cerrar la app.
