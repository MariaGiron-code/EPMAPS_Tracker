# ADR-008: Guardar la sesión del técnico con expo-secure-store

## Estado
Aceptado.

## Fecha
27/10/2026

## Requisitos relacionados
R1 (el técnico sigue identificado al cerrar y abrir la app; al cerrar sesión, se le vuelve a pedir su código de empleado y clave).

## Contexto
La sesión contiene el código de empleado y la clave. Aunque en esta prueba los datos del técnico pueden estar quemados, la clave no debe quedar en texto plano en el teléfono. La app necesita recordar la sesión entre aperturas, y borrarla al cerrar sesión.

## Alternativas consideradas

| Alternativa | Ventajas en este proyecto | Desventajas en este proyecto |
|---|---|---|
| expo-secure-store | Guarda los datos en el almacén seguro del sistema, cifrados. Se usa igual en Expo Go y en el APK. | Tiene un límite de tamaño por valor. Es una dependencia más. |
| AsyncStorage | Ya lo usamos en el deber. | Guarda los datos sin cifrar. Una clave en texto plano es una mala práctica. |
| Solo memoria (Zustand sin persistir) | No añade dependencias. | No cumple R1: al cerrar la app la sesión se pierde. |

## Decisión
Se usa expo-secure-store para guardar el código de empleado y un indicador de sesión activa. La clave se compara con los datos quemados al iniciar sesión y no se guarda. Al cerrar sesión, se borran ambos valores.

## Consecuencias
- Gana: la sesión sobrevive al cierre de la app sin guardar la clave en texto plano.
- Pierde: una dependencia más que justificar.
- Riesgo: si el usuario desinstala la app, la sesión se pierde. Ese comportamiento es el esperado.

## Verificación
- Revisar que la clave no se escribe en ningún almacenamiento y que cerrar sesión borra las dos entradas.
- En el teléfono: iniciar sesión, cerrar la app y abrirla. El técnico debe seguir identificado. Cerrar sesión y comprobar que se vuelven a pedir el código y la clave.

## Uso de IA
Consulté a la IA dónde guardar la sesión. Me recomendó expo-secure-store para no guardar la clave sin cifrar. Acepté la recomendación. Descarté AsyncStorage porque deja la clave en texto plano.
