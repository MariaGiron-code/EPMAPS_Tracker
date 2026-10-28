# EPMAPS_Tracker

## Aplicación móvil para el registro de lecturas de medidores de agua

**Proyecto académico:** Prueba I técnica de Desarrollo Móvil
**Institución beneficiaria:** Empresa Pública Metropolitana de Agua Potable y Saneamiento (EPMAPS)
**Plataforma objetivo:** Android
**Versión:** 1.0.0
**Estado:** Implementación y validación funcional

---

## 1. Resumen

**EPMAPS_Tracker** es una aplicación móvil para que los técnicos de EPMAPS
registren lecturas de medidores de agua directamente en campo. La aplicación
está diseñada para trabajar con o sin conexión a internet: las lecturas se
almacenan localmente y se sincronizan automáticamente cuando se recupera la
señal.

El sistema busca reducir errores de transcripción, conservar evidencia
fotográfica cuando sea necesaria y evitar registros duplicados del mismo
medidor durante un mismo mes.

## 2. Objetivos

### Objetivo general

Desarrollar una aplicación móvil que permita consultar medidores y registrar
lecturas de forma segura, persistente y tolerante a fallos de conectividad.

### Objetivos específicos

- Autenticar al técnico antes de permitir el acceso a la aplicación.
- Consultar medidores mediante su código `MED-` seguido de seis dígitos.
- Registrar lecturas normales, medidores inaccesibles y medidores dañados.
- Mantener el flujo operativo sin conexión a internet.
- Detectar consumos anómalos y solicitar confirmación y fotografía.
- Guardar borradores para continuar registros incompletos.
- Sincronizar automáticamente las lecturas pendientes.
- Impedir duplicados por medidor y mes.

## 3. Alcance funcional

La aplicación implementa las siguientes funciones:

1. **Inicio de sesión:** validación de técnico y persistencia segura de la
   sesión.
2. **Consulta de medidores:** búsqueda por código, datos generales, lectura
   anterior y consumo promedio.
3. **Registro de lecturas:** captura de lectura, estado del medidor, motivos y
   descripción de daños.
4. **Trabajo offline:** almacenamiento local en SQLite sin depender de la red
   para guardar.
5. **Borradores:** recuperación o descarte de registros iniciados.
6. **Control de consumo:** cálculo de consumo y advertencia cuando supera el
   triple del promedio.
7. **Fotografía:** evidencia obligatoria para consumos anómalos o medidores
   dañados.
8. **Lecturas pendientes:** consulta, edición y envío manual de registros
   pendientes.
9. **Sincronización automática:** envío al recuperar conectividad mediante
   NetInfo.
10. **Control de integridad:** una lectura por medidor y mes e idempotencia
    mediante `uuid`.

## 4. Tecnologías utilizadas

| Categoría | Tecnología |
|---|---|
| Framework móvil | React Native |
| SDK | Expo SDK 57 |
| Lenguaje | TypeScript estricto |
| Navegación | Expo Router |
| Estado global | Zustand |
| Formularios | React Hook Form + Zod |
| Consultas y caché | TanStack Query |
| Persistencia local | Expo SQLite |
| Sesión segura | Expo Secure Store |
| Conectividad | React Native NetInfo |
| Evidencia fotográfica | Expo Image Picker + Expo File System |
| API de prueba | MockAPI |
| Construcción Android | EAS Build |

No se utiliza una dependencia de desenfoque para el diseño visual. El efecto
glassmorphism se construye con translucidez, bordes, sombras y tokens visuales.

## 5. Arquitectura del proyecto

```text
app/
├── _layout.tsx              # Layout principal y guard de sesión
├── login.tsx                # Inicio de sesión
├── index.tsx                # Consulta de medidores
├── pendientes.tsx           # Lecturas pendientes y edición
└── medidor/
    └── [codigo].tsx         # Registro de lectura

src/
├── api/                     # Cliente y consultas a MockAPI
├── components/              # Componentes visuales reutilizables
├── constants/               # Tokens del sistema de diseño
├── db/                      # Inicialización del esquema SQLite
├── schemas/                 # Validaciones Zod
├── services/                # Operaciones de lecturas
├── store/                   # Estado global y borradores
├── sync/                    # Envío automático y estado de conectividad
└── utils/                   # Funciones auxiliares

assets/                      # Logo e iconos oficiales
docs/                        # Historias, ADR y sistema de diseño
specs/                       # Especificaciones, planes y tareas
```

## 6. Persistencia e integridad de datos

La aplicación utiliza SQLite para conservar la información aun cuando no haya
conectividad.

### Tabla `medidores`

Contiene la información local de referencia del medidor:

- `codigo`
- `direccion`
- `sector`
- `cuenta`
- `estado`
- `ultima_lectura`
- `fecha_ultima`
- `consumo_promedio`

### Tabla `lecturas`

Contiene los registros creados por el técnico:

- `uuid`
- `codigo_medidor`
- `mes`
- `lectura`
- `estado_medidor`
- `motivo`
- `descripcion_dano`
- `foto_ruta`
- `estado_envio`
- `creado_en`

La base local aplica las siguientes restricciones:

- `UNIQUE(uuid)` para garantizar idempotencia.
- `UNIQUE(codigo_medidor, mes)` para impedir más de una lectura mensual por
  medidor.
- Estados de envío válidos: `pendiente`, `enviando` y `enviada`.

## 7. Configuración de MockAPI

Defina la variable de entorno `EXPO_PUBLIC_MOCKAPI_URL` en un archivo `.env`:

```text
EXPO_PUBLIC_MOCKAPI_URL=https://TU_PROYECTO.mockapi.io/api/v1
```

La API debe incluir los recursos:

- `medidores`
- `lecturas`

El recurso `medidores` debe contener, como mínimo, `codigo`, `direccion`,
`sector`, `cuenta`, `estado`, `ultima_lectura`, `fecha_ultima_lectura` y
`consumo_promedio`.

El recurso `lecturas` debe contener, como mínimo, `uuid`, `codigo_medidor`,
`mes`, `lectura`, `estado_medidor`, `motivo`, `descripcion_dano`, `consumo`,
`anomalo`, `foto_ruta`, `estado_envio` y `creado_en`.

La aplicación acepta `fecha_ultima_lectura` desde MockAPI y la normaliza para
su uso interno. La unicidad mensual se verifica en SQLite local, no solamente
en MockAPI.

## 8. Instalación y ejecución

Requisitos previos:

- Node.js y npm.
- Android Studio o un dispositivo Android con depuración USB.
- Cuenta de Expo/EAS para crear el APK.

Instalación:

```powershell
cd C:\Prueba1
npm.cmd install
```

Iniciar el proyecto:

```powershell
npm.cmd start
```

Limpiar la caché de Metro:

```powershell
npx expo start -c
```

Ejecutar en Android:

```powershell
npm.cmd run android
```

## 9. Verificación de calidad

Antes de entregar cambios, ejecutar:

```powershell
npm.cmd run typecheck
npm.cmd run lint
```

También se recomienda comprobar el formato del diff:

```powershell
git --no-pager diff --check
```

La aplicación se valida con el recorrido principal:

1. Abrir la aplicación sin sesión.
2. Iniciar sesión.
3. Consultar un código válido.
4. Registrar una lectura normal.
5. Probar los estados inaccesible y dañado.
6. Guardar sin señal.
7. Recuperar la conectividad y verificar el envío.
8. Editar una lectura pendiente.
9. Confirmar que una lectura enviada no sea editable.
10. Intentar registrar dos veces el mismo medidor en el mismo mes.

## 10. Credenciales de prueba

La implementación académica utiliza datos de acceso definidos para pruebas:

```text
Código: TEC001
Clave: 1234
```

Estas credenciales son únicamente de demostración y no deben utilizarse como
credenciales reales de producción.

## 11. Construcción del APK

Instalar EAS CLI e iniciar sesión:

```powershell
npm.cmd install --global eas-cli
eas login
eas whoami
```

Crear un APK instalable para pruebas:

```powershell
eas build --platform android --profile preview
```

Crear una compilación de producción:

```powershell
eas build --platform android --profile production
```

La configuración de perfiles se encuentra en [eas.json](./eas.json).

## 12. Sistema de diseño

La interfaz utiliza glassmorphism sobre fondo oscuro, con la identidad visual
de EPMAPS y el logo oficial.

- Los tokens ejecutables están en `src/constants/theme.ts`.
- La especificación visual está en `docs/design-system.md`.
- El logo oficial está en `assets/logo/`.
- Los colores, espacios, radios y tamaños no deben definirse directamente en
  las pantallas.
- Las pantallas contemplan estados de carga, error, vacío y pendiente.

## 13. Documentación académica

| Documento | Descripción |
|---|---|
| `docs/constitution.md` | Principios no negociables del proyecto |
| `docs/historias/` | Historias de usuario |
| `docs/adr/` | Decisiones de arquitectura |
| `docs/design-system.md` | Sistema de diseño visual |
| `specs/001-registro-lectura/` | Especificación del registro de lecturas |
| `specs/002-diseno-visual/` | Especificación visual |
| `specs/003-auditoria-funcional/` | Auditoría funcional |

El desarrollo sigue el flujo **Specification-Driven Development (SDD)**:

1. Decisiones.
2. Especificación.
3. Plan.
4. Tareas.
5. Implementación.
6. Validación.

## 14. Limitaciones conocidas

- MockAPI se utiliza como servicio de demostración y no representa un backend
  productivo.
- El envío automático depende de que el dispositivo recupere conectividad.
- La restricción de una lectura mensual se conserva localmente en SQLite.
- La fotografía se almacena localmente y se envía como referencia de ruta,
  según el alcance definido para la prueba.

## 15. Licencia y uso académico

Este proyecto fue desarrollado para fines académicos y de evaluación técnica.
Su contenido debe mantenerse dentro del alcance autorizado por la institución
y no debe incorporar código de otros estudiantes o repositorios externos.
