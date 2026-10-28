---
name: glassmorphism-ui
description: Sistema de diseño de EPMAPS_Tracker: Glassmorphism, paleta de marca y logo oficial. Úsalo al crear o modificar cualquier pantalla, componente o token visual.
---

# Estilo visual de EPMAPS_Tracker

Resumen operativo. La fuente completa es `docs/design-system.md`; los valores exactos, en `src/constants/theme.ts`.

## Paleta (derivada del logo)

- Primario `#005AA9` (acciones, «enviada», marca) · oscurecido al presionar `#003F78`.
- Acento `#E63946` (advertencias, «pendiente», punto tracker): solo iconos, bordes, pastillas o texto ≥ 19 px en negrita; para texto de alerta, `#B4232E`.
- Fondo `#1C1C1E` con degradado a `#0B2C4C`. Texto sobre oscuro: `#FFFFFF` y `rgba(255,255,255,0.72)`.
- Ningún hex se escribe en una pantalla: todo sale de `theme.ts`.

## Glassmorphism (sin blur, sin dependencias)

1. Fondo de pantalla: degradado 135° `colorBg` → `colorBgGradientEnd`.
2. Superficie: `rgba(255,255,255,0.10)` + borde 1 px `rgba(255,255,255,0.18)` + borde superior `rgba(255,255,255,0.35)` + radio 20 + sombra (`shadowOpacity 0.35`, `shadowRadius 16`, `elevation 8`).
3. Variantes: `glass` (tarjetas), `glassStrong` (modales), `glassInput` (campos, foco en `colorPrimary`), `buttonPrimary` (`#005AA9` sólido con texto blanco), `buttonGhost`.
4. No se instala `expo-blur`: el vidrio es translucidez + borde + sombra (D-14).

## Logo

- Archivos en `assets/logo/` (`epmaps-tracker-logo.png` @2x y `epmaps-tracker-icon.png`).
- Nombre de la app: `EPMAPS_Tracker`. Sin deformar, sin recolorear, ancho ≥ 120 px, área de respeto del diámetro del punto rojo.
- Sobre fondo oscuro: logo sobre superficie glass clara o solo el símbolo del pin ("Tracker" es `#333333` y ahí no se lee).

## Los cuatro estados, siempre

Cargando (esqueletos glass animados) · error (mensaje + «Reintentar» de 44 px) · vacío (pin al 30 % + acción) · pendiente (pastilla con punto rojo + contador).

## Accesibilidad (RNF-04)

Contraste ≥ 4,5:1 en texto normal, ≥ 3:1 en iconos; objetivos ≥ 44 px; ningún estado solo con color (icono + texto).

## Al terminar

`npx tsc --noEmit` y `npx expo lint` deben pasar, y el agente `frontend-designer` debe reportar «cumple» en RF-D-01 a RF-D-05 (`specs/002-diseno-visual/spec.md`) antes de marcar la tarea `[x]`.
