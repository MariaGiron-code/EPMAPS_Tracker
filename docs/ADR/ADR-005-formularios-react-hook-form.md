# ADR-005: Manejar los formularios de registro con react-hook-form y zodResolver

## Estado
Aceptado.

## Fecha
27/10/2026

## Requisitos relacionados
R5 (campos obligatorios según el estado del medidor), R6 (confirmación del consumo anómalo), R7 (foto obligatoria en algunos casos), R10 (corrección de lecturas pendientes).

## Contexto
El formulario de la lectura cambia según el estado seleccionado. Si el estado es inaccesible, se muestra el campo de motivo y se oculta la lectura. Si el consumo es anómalo, aparecen la confirmación y la foto obligatoria. Además, una lectura pendiente debe poder editarse con los mismos campos, sin volver a escribir todo.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
|---|---|---|
| react-hook-form con zodResolver | Cada campo no vuelve a renderizar todo el formulario al escribir. La integración con zod usa el esquema de ADR-004. | Dos paquetes que justificar: react-hook-form y @hookform/resolvers. Hay que entender su API. |
| `useState` por campo | No añade dependencias. | En un formulario con varios pasos y reglas cruzadas, el código crece y se repite la validación. |
| Formik | Muy conocido y con documentación amplia. | Vuelve a renderizar más al escribir y necesita más código para integrarse con zod. |

## Decisión
Se usa react-hook-form con zodResolver. Las reglas de R5 y R6 viven en el esquema de ADR-004, y el formulario solo las aplica.

## Consecuencias
- Gana: formularios con menos renderizados y reglas que no se repiten.
- Pierde: dos paquetes más que justificar en el proyecto.
- Riesgo: al ocultar un campo según el estado, su valor anterior puede seguir en el formulario y pasar la validación. Al cambiar de estado, el campo oculto debe limpiarse.

## Verificación
- Revisar que el cambio de estado limpia el campo de lectura cuando el estado es inaccesible.
- En el teléfono: elegir "inaccesible" sin motivo y comprobar que no se guarda. Elegir "dañado" sin descripción y comprobar el error. Elegir "dañado" con la lectura vacía y comprobar que sí se guarda.

## Uso de IA
Consulté a la IA si podía manejar el formulario con useState. Me indicó que las reglas cruzadas crecerían y se repetirían en cada paso. Acepté react-hook-form porque separa las reglas (zod) del formulario. Descarté Formik porque renderiza más al escribir.
