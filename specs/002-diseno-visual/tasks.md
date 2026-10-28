# Tareas — sistema de diseño visual

Cada tarea se hace en una sesión nueva (`/new`) y cita los RF que cubre.
Dependen de **T-01 (proyecto base)** de `specs/001-registro-lectura/tasks.md`, porque crean archivos dentro del proyecto Expo.

- [ ] **TD-01 · Tokens de diseño.** Crear `src/constants/theme.ts` con la paleta, escala de espacios, radios, sombras, tipografía y variantes glass del design system. (RF-D-01, RNF-D-02)
  - Hecho cuando: `grep -rE "#[0-9A-Fa-f]{3,8}" app/ src/components/` no encuentra colores literales fuera de `theme.ts`, y el archivo compila con `npx tsc --noEmit`.

- [ ] **TD-02 · Logo en el proyecto.** Copiar los PNG y el SVG de `assets/logo/` al proyecto y mostrarlos en login e icono de la app. (RF-D-03)
  - Hecho cuando: el logo aparece sin deformar en el login con ancho ≥ 120 px, y el icono de la app es el pin sobre fondo oscuro.

- [ ] **TD-03 · Componentes glass.** `GlassView`, `GlassInput`, `GlassButton` y `BrandLogo` con la receta glass y las variantes. (RF-D-02)
  - Hecho cuando: una pantalla de prueba muestra los cuatro componentes con borde luminoso y sombra, sin `expo-blur` instalado.

- [ ] **TD-04 · Los cuatro estados.** Componente `StateView` para cargando, error con reintento, vacío y pendiente. (RF-D-04)
  - Hecho cuando: cada estado se renderiza con contenido real, icono y texto, y el botón de reintento mide ≥ 44 px.

- [ ] **TD-05 · Validación visual.** Revisión con el agente `frontend-designer` + `npx tsc --noEmit` + `npx expo lint` + verificación de contraste. (RF-D-05, RNF-D-03)
  - Hecho cuando: el agente reporta «cumple» en RF-D-01 a RF-D-05 en una tabla con archivo y línea, y typecheck y lint pasan.
