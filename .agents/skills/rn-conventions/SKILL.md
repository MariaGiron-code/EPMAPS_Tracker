---
name: rn-conventions
description: Convenciones de React Native con Expo Router para este proyecto. Úsalo al crear pantallas, componentes, hooks o servicios.
---

# Convenciones React Native

## Rutas
- Cada archivo dentro de `app/` es una pantalla. Solo pantallas y layouts.
- Componentes, hooks, servicios y esquemas van fuera de `app/`, en `src/` o `components/`.
- Navega con `router.push` usando la ruta tipada (`pathname` y `params`).

## Datos
- Las pantallas no llaman a la red ni a la base de datos. Usan hooks.
- Las consultas a MockAPI usan TanStack Query con claves jerárquicas.
- Las lecturas viven en SQLite. El estado de la interfaz vive en Zustand.

## Diseño
- Colores, espacios y tipografía vienen de `src/constants/theme.ts`.
- Cada pantalla diseña cargando, error con reintento, vacío y pendiente.
- Toques de al menos 44 px. Ningún estado depende solo del color.

## TypeScript
- Modo estricto. Sin `any` salvo que se justifique en un comentario.
- Tipos de datos externos se derivan de los esquemas zod, no se escriben a mano.
