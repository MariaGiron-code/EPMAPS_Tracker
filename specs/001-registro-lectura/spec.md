# Especificación: Registro de lecturas de medidores

**Estado:** aprobada (27/10/2026)
**Historia:** `docs/historias/HU-001.md`
**Decisiones:** `specs/001-registro-lectura/decisiones.md`

## Requisitos funcionales

**RF-01 · Sesión (R1)**
- Dado que ingreso código de empleado y clave válidos (datos quemados), cuando abro la app por primera vez, entonces entro a la pantalla principal.
- Dado que cerré la app con sesión activa, cuando la abro, entonces sigo identificado sin pedir datos.
- Dado que cierro sesión, cuando abro la app, entonces se me pide código y clave.

**RF-02 · Código del medidor (R2)**
- Dado que escribo un código que no cumple `MED-` seguido de exactamente seis dígitos, cuando intento consultar, entonces veo un error y no se hace ninguna petición.
- Dado que escribo `MED-123456`, cuando consulto, entonces se hace exactamente una petición a MockAPI.

**RF-03 · Consulta y caché (R3)**
- Dado que hay señal y el código es válido, cuando consulto, entonces se muestran dirección, sector, número de cuenta, estado, última lectura con fecha y consumo promedio mensual.
- Dado que ya consulté un medidor en la jornada, cuando lo consulto sin señal, entonces se muestran sus datos sin error y sin nueva descarga.

**RF-04 · Registro sin señal (R4)**
- Dado que no hay señal, cuando registro una lectura, entonces se guarda con estado "pendiente de verificar" y se muestra la lectura anterior como referencia.
- Dado que se recupera la señal, cuando se envía, entonces se compara con la lectura anterior y el estado cambia según el resultado.

**RF-05 · Estados del medidor (R5)**
- Dado que el estado es "normal", cuando guardo, entonces la lectura es obligatoria.
- Dado que el estado es "inaccesible", cuando guardo, entonces el motivo es obligatorio y no se permite lectura.
- Dado que el estado es "dañado", cuando guardo, entonces la descripción del daño es obligatoria y la lectura es opcional.

**RF-06 · Consumo y advertencia (R6)**
- El consumo del mes es la lectura actual menos la anterior.
- Dado que el consumo supera el triple del promedio mensual, cuando guardo, entonces se muestra una advertencia y debo confirmar que revisé el medidor.
- Si no existe una lectura anterior del medidor, el consumo no se calcula y no se activa la advertencia.

**RF-07 · Foto (R7)**
- La foto es obligatoria si el consumo es anómalo (RF-06) o el medidor está dañado; en los demás casos es opcional.
- La foto se conserva en el teléfono aunque la lectura siga pendiente, y sobrevive a reinicios.
- Dado que el permiso de cámara está denegado y la foto es obligatoria, cuando intento guardar, entonces la app explica por qué la necesita y no guarda.
- Dado que el permiso está denegado y la foto es opcional, cuando guardo, entonces puedo continuar.

**RF-08 · Registro en varios pasos (R8)**
- El borrador se guarda en cada paso.
- Dado que cierro la app a mitad de un registro, cuando la abro, entonces se ofrece continuar o descartar.
- Dado que elijo continuar, cuando se abre el registro, entonces los datos ya ingresados están presentes.

**RF-09 · Envío automático (R9)**
- Dado que hay lecturas pendientes y se recupera la señal, cuando la app detecta la conexión, entonces envía las lecturas sin acción mía.
- Dado que la señal se corta durante un envío, cuando se reintenta, entonces MockAPI tiene una sola lectura con ese identificador.
- En todas las pantallas se muestran el estado de conexión y el número de lecturas pendientes.

**RF-10 · Corrección y unicidad (R10)**
- Dado que una lectura está pendiente, cuando la edito, entonces se guardan los cambios.
- Dado que una lectura está enviada, cuando intento editarla, entonces la acción no está disponible.
- Dado que ya existe una lectura del mismo medidor en el mismo mes, cuando intento registrar otra, entonces se rechaza con un mensaje.

## Requisitos no funcionales

- **RNF-01 Offline:** ninguna pantalla de registro depende de la conexión para guardar.
- **RNF-02 Integridad:** ninguna lectura queda duplicada ni a medias, aunque la app se cierre o se corte la señal.
- **RNF-03 Seguridad:** la clave no se guarda en texto plano.
- **RNF-04 Diseño:** texto con contraste mínimo de 4.5:1, objetivos táctiles de 44 px, y ningún estado comunicado solo con color.
- **RNF-05 Técnico:** Expo SDK 57, TypeScript estricto, y cada dependencia justificada en un ADR.
