# Decisiones (grill-me, 27/10/2026)

Decisiones tomadas para el sistema de diseño visual de EPMAPS_Tracker. Continúa la numeración de `specs/001-registro-lectura/decisiones.md`.

| # | Tema | Elegido | Descartado |
|---|---|---|---|
| D-12 | Paleta de colores | Derivarla del logo: `#005AA9`, `#E63946`, `#FFFFFF`, `#333333`, fondo `#1C1C1E`, más tonos derivados documentados | Esperar una paleta externa; inventar una paleta nueva |
| D-13 | Logo en la app | PNG generado desde el SVG fuente, usado con `Image` nativo (cero dependencias) | `react-native-svg` con ADR-009 |
| D-14 | Efecto Glassmorphism | Vidrio simulado: translucidez + borde 1 px + sombra, sin desenfoque | `expo-blur` con ADR-009 (dependencia y diferencia entre dispositivos) |
| D-15 | Ubicación en el flujo SDD | Spec nueva `specs/002-diseno-visual/` con agente `frontend-designer` y skill `glassmorphism-ui` propios | Meter el diseño en la spec 001 como un RNF más |
| D-16 | Tipografía | Fuente del sistema, escala definida en `theme.ts` | Instalar @expo-google-fonts (dependencia nueva) |

## Pendientes de confirmar
- Valor exacto del color final del degradado de fondo (`#0B2C4C`, derivado de `#005AA9`) al verlo en el dispositivo.
- Confirmación visual del logo en el login real (Tarea TD-02) antes de fijar el tamaño mínimo definitivo.
