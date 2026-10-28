# ADR-004: Validar datos del técnico y de MockAPI con zod

## Estado
Aceptado.

## Fecha
27/10/2026

## Requisitos relacionados
R2 (el código del medidor debe tener el formato MED- seguido de seis dígitos, y no debe consultarse un código incompleto), R5 (reglas por estado del medidor), R6 (consumo anómalo).

## Contexto
Hay dos fuentes de datos que pueden ser incorrectas: lo que escribe el técnico y lo que llega de MockAPI. Las reglas de R5 cambian según el estado del medidor, por ejemplo, el motivo es obligatorio si el estado es inaccesible. Esas reglas deben estar en un solo lugar y deben poder explicarse con claridad en la defensa.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
|---|---|---|
| zod | Un esquema define la regla y el tipo de TypeScript a la vez. Las reglas condicionales se escriben en el mismo lugar. Sirve también para validar la respuesta de MockAPI. | Es una dependencia más. Las reglas con validaciones cruzadas pueden ser difíciles de depurar. |
| Validación manual | No añade dependencias. | Las reglas se dispersan entre pantallas. Es fácil olvidar una y no hay forma automática de comprobar que todas se cumplen. |
| Yup | Sintaxis parecida a zod y muy usada en formularios. | El tipado con TypeScript es más débil, así que no se obtiene el tipo del dato automáticamente. |

## Decisión
Se usa zod. Hay un esquema para el código del medidor (formato exacto `MED-` seguido de seis dígitos) y un esquema para la lectura con las reglas de R5 y R6. Las respuestas de MockAPI también pasan por un esquema antes de usarse.

## Consecuencias
- Gana: una sola fuente de reglas y tipos. Se puede explicar cada regla con un nombre.
- Pierde: una dependencia más, y una curva de aprendizaje para las validaciones cruzadas.
- Riesgo: si el esquema de MockAPI cambia, la validación rechazará datos válidos. Por eso el esquema debe coincidir con el recurso `medidores` que se crea en MockAPI.

## Verificación
- Revisar el archivo de esquemas: debe existir una regla exacta para el código del medidor.
- En el teléfono: escribir `MED-12345` (incompleto) y comprobar que aparece el error sin hacer ninguna petición. Escribir `med-123456` en minúsculas y comprobar que también se rechaza.

## Uso de IA
Consulté a la IA entre zod y Yup. Ambas servían, pero zod ofrece tipos inferidos del esquema, así que decidí usar zod. La IA me propuso validar el código del medidor con una expresión regular suelta. Acepté la idea, pero la envolví en un esquema zod para que las reglas estén en el mismo lugar.
