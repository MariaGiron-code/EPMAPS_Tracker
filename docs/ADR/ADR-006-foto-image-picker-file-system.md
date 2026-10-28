# ADR-006: Capturar la foto con expo-image-picker y conservarla con expo-file-system

## Estado
Aceptado.

## Fecha
27/10/2026

## Requisitos relacionados
R6 (la foto es obligatoria si el consumo supera el triple del promedio), R7 (la foto es obligatoria si el medidor está dañado o el consumo es anómalo, y debe conservarse varios días; si el permiso de cámara se niega, la app explica por qué lo necesita), R8 (la foto debe estar disponible al continuar un registro).

## Contexto
La foto es el respaldo de la lectura, así que no puede perderse aunque el teléfono se reinicie o la lectura espere varios días a que haya señal. La app también debe manejar el caso de permiso denegado. Android puede borrar los archivos temporales de caché, por lo que la ruta que devuelve la cámara no puede usarse como almacenamiento definitivo.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
|---|---|---|
| expo-image-picker | Abre la cámara con su propio flujo de permisos. Requiere poco código para obtener la foto. | No controlamos la interfaz de la cámara, así que no podemos mostrar una guía sobre el medidor. |
| expo-camera | Control total de la vista y del permiso. Permite mostrar una guía sobre el medidor. | Más código y más pantallas que mantener. El manejo del permiso queda a nuestro cargo. |
| Guardar solo la ruta temporal que devuelve la cámara | No necesita copiar archivos. | Android puede borrar esos archivos, y entonces se incumple R7. |

## Decisión
Se usa expo-image-picker para tomar la foto. Después, la foto se copia con expo-file-system a un directorio persistente, y en SQLite (ADR-001) se guarda solo la ruta de la copia.

## Consecuencias
- Gana: la foto sobrevive a reinicios y a la espera de conexión.
- Pierde: no hay guía visual de la cámara, porque la interfaz es la del sistema.
- Riesgo: las fotos ocupan espacio. Por eso la copia solo se borra cuando la lectura se confirma como enviada.
- Obligación: si el permiso se niega, hay que mostrar el motivo y permitir continuar solo cuando la foto no es obligatoria.

## Verificación
- Revisar que la ruta de la foto se guarda en SQLite y que la copia está en el directorio persistente.
- En el teléfono: tomar una foto, reiniciar el teléfono y abrir la lectura pendiente. La foto debe verse.
- Negar el permiso de cámara en un consumo anómalo y comprobar que la app muestra el motivo y no deja guardar.

## Uso de IA
Consulté a la IA entre expo-camera y expo-image-picker. Me recomendó expo-image-picker por ser más simple y cumplir el permiso. Acepté la recomendación. Descarté guardar la ruta temporal de la cámara, porque Android puede borrarla y eso incumple R7.
