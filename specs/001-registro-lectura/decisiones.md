# Decisiones (grill-me, 27/10/2026)

Registro de las preguntas hechas antes de escribir la spec y las respuestas elegidas.

| # | Tema | Elegido | Descartado |
|---|---|---|---|
| D-01 | Repositorio | Repo nuevo, con `docs/adr/` como primer commit | Reusar el repo del deber |
| D-02 | Almacenamiento local | expo-sqlite | AsyncStorage, archivos JSON |
| D-03 | Formularios | react-hook-form + zod | Validación manual con useState |
| D-04 | Estado compartido | Zustand con persistencia | Context de React, solo base de datos |
| D-05 | Consultas a MockAPI | TanStack Query con caché de 8 h | Tabla de caché en SQLite, fetch sin caché |
| D-06 | Foto | expo-image-picker + copia con expo-file-system | expo-camera, ruta temporal |
| D-07 | Conexión y envío | NetInfo + envío al recuperar red | expo-background-task, expo-network |
| D-08 | Sesión | expo-secure-store | AsyncStorage, solo memoria |
| D-09 | Foto a servicio externo | No (opcional, fuera de alcance) | Subir a un servicio de imágenes |
| D-10 | Orden de trabajo | ADR y repo antes de instalar dependencias | Empezar por la app |
| D-11 | Consumo sin lectura anterior | No calcular consumo ni advertir | Usar cero como lectura anterior |

## Pendientes de confirmar
- Valor exacto de 8 horas para la caché (propuesta).
- Restricción UNIQUE sobre medidor y mes (propuesta).
