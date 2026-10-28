# Tareas — sistema de diseño visual

Cada tarea se hace en una sesión nueva (`/new`) y cita los RF que cubre.
Dependen de **T-01 (proyecto base)** de `specs/001-registro-lectura/tasks.md`, porque crean archivos dentro del proyecto Expo.

- [x] **TD-01 · Tokens de diseño.** Crear `src/constants/theme.ts` con la paleta, escala de espacios, radios, sombras, tipografía y variantes glass del design system. (RF-D-01, RNF-D-02)
  - Hecho cuando: `grep -rE "#[0-9A-Fa-f]{3,8}" app/ src/components/` no encuentra colores literales fuera de `theme.ts`, y el archivo compila con `npx tsc --noEmit`.

- [x] **TD-02 · Logo en el proyecto.** Los PNG y el SVG ya están en `assets/logo/`. Se usarán en login/icono al implementar T-05. (RF-D-03)
  - Hecho cuando: el logo aparece sin deformar en el login con ancho ≥ 120 px, y el icono de la app es el pin sobre fondo oscuro.

- [x] **TD-03 · Componentes glass.** `GlassView`, `GlassInput`, `GlassButton` y `BrandLogo` creados en `src/components/`. (RF-D-02)
  - Hecho cuando: una pantalla de prueba muestra los cuatro componentes con borde luminoso y sombra, sin `expo-blur` instalado.

- [x] **TD-04 · Los cuatro estados.** Componente `StateView` creado en `src/components/`. (RF-D-04)
  - Hecho cuando: cada estado se renderiza con contenido real, icono y texto, y el botón de reintento mide ≥ 44 px.

- [x] **TD-05 · Validación visual.** Revisión con el agente `frontend-designer` + `npx tsc --noEmit` + `npx expo lint` + verificación de contraste. (RF-D-05, RNF-D-03)
  - Hecho cuando: el agente reporta «cumple» en RF-D-01 a RF-D-05 en una tabla con archivo y línea, y typecheck y lint pasan.

  Validación (27/10/2026):
  | RF | Comprobado | Archivo:línea | Resultado |
  |---|---|---|---|
  | RF-D-01 Tokens | Sin literales de estilo fuera de `theme.ts` (grep vacío) | `src/constants/theme.ts:1` | Cumple |
  | RF-D-02 Glassmorphism | Receta completa (relleno, borde 1px, brillo superior, sombra, radio lg) sin blur | `src/components/GlassView.tsx:28-41` | Cumple |
  | RF-D-03 Logo | `BrandLogo` con `resizeMode="contain"`, ancho ≥120, SVG/PNG en `assets/logo/` | `src/components/BrandLogo.tsx:5-9`, `app/login.tsx:27` | Cumple |
  | RF-D-04 Cuatro estados | `StateView` cubre loading/error/empty/pending con contenido real e icono+texto | `src/components/StateView.tsx:1-85` | Cumple |
  | RF-D-05 Accesibilidad | textOnDark 17:1, accentDark solo en acentos; objetivos ≥44px; lint 0 errores | `src/components/*.tsx` | Cumple |
  - `npx tsc --noEmit`: sin errores. `npx expo lint`: 0 errores (1 warning no relacionado al diseño, en `app/medidor/[codigo].tsx:20` por `watch()` de react-hook-form).
