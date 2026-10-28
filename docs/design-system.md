# Sistema de diseño — EPMAPS_Tracker

Fuente de verdad visual de la app. Todo lo que se dibuje en una pantalla sale de aquí.
Lo aplica el agente `frontend-designer` (`.opencode/agents/frontend-designer.md`) con la skill `glassmorphism-ui` (`.agents/skills/glassmorphism-ui/SKILL.md`).
Los tokens viven en `src/constants/theme.ts` (tarea TD-01, `specs/002-diseno-visual/`).

## 1. Identidad

- **Nombre de la app:** `EPMAPS_Tracker` (así aparece en títulos, icono y documentación).
- **Estilo:** Glassmorphism sobre fondo oscuro: tarjetas translúcidas con borde luminoso y sombra, sin desenfoque (decisión D-14, sin dependencias).

### Logo

| Archivo | Uso | Tamaño |
|---|---|---|
| `assets/logo/epmaps-tracker-logo.svg` | Fuente de verdad (SVG original) | vectorial |
| `assets/logo/epmaps-tracker-logo.png` | Logo completo @2x (headers, splash, documentos) | 1200×360 |
| `assets/logo/epmaps-tracker-logo-1x.png` | Logo completo @1x (vistas previas, README) | 600×180 |
| `assets/logo/epmaps-tracker-icon.png` | Icono de la app (solo el pin, fondo `#1C1C1E`) | 1024×1024 |

Reglas del logo:
1. No se deforma, no se rota, no se recolorea, no se le agrega texto ni sombra propia.
2. Ancho mínimo del logo completo: 120 px. Área de respeto: el diámetro del punto rojo (`#E63946`) a cada lado.
3. El logo completo usa sus colores originales. Como "Tracker" es `#333333`, sobre fondo oscuro se coloca sobre una superficie glass clara o se usa **solo el símbolo del pin**; nunca se inventan colores alternativos del logo.
4. En pantallas se usa con `<Image source={require(...)}/>` con la proporción 600:180; `resizeMode="contain"`.

## 2. Paleta

Derivada de los colores del logo (decisión D-12). Los valores con «derivado» son tonos del mismo tono de marca, solo para fondos y estados; los cuatro colores base nunca cambian.

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `colorPrimary` | `#005AA9` | acciones primarias, pin, títulos de marca, estado «enviada» | 6,9:1 sobre blanco ✅ |
| `colorPrimaryDark` | `#003F78` (derivado) | presionado, degradado de fondo | — |
| `colorPrimarySoft` | `#E8F1FA` (derivado) | fondos claros de tarjeta, badges | — |
| `colorAccent` | `#E63946` | advertencias, punto tracker, línea distintiva, «pendiente» | 4,2:1 sobre blanco ⚠️ |
| `colorAccentDark` | `#B4232E` (derivado) | **texto** de alerta sobre fondo claro | 6,6:1 sobre blanco ✅ |
| `colorAccentSoft` | `#FDEBEC` (derivado) | fondo de alerta | — |
| `colorBg` | `#1C1C1E` | fondo base de la app | — |
| `colorBgGradientEnd` | `#0B2C4C` (derivado) | extremo del degradado de fondo (135°) | — |
| `colorSurface` | `#FFFFFF` | tarjetas opacas, modales de confirmación | — |
| `colorText` | `#333333` | texto sobre superficies claras | — |
| `colorTextOnDark` | `#FFFFFF` | texto principal sobre oscuro/glass | 17:1 sobre `#1C1C1E` ✅ |
| `colorTextOnDarkSecondary` | `rgba(255,255,255,0.72)` | texto secundario sobre oscuro | ≈8:1 ✅ |
| `colorGlassFill` | `rgba(255,255,255,0.10)` | relleno glass (rango permitido 0,08–0,14) | — |
| `colorGlassBorder` | `rgba(255,255,255,0.18)` | borde de superficie glass | — |
| `colorBorderStrong` | `rgba(255,255,255,0.35)` | borde superior de brillo | — |

Uso restringido de `#E63946`: iconos, bordes, puntos, pastillas y texto en negrita ≥ 19 px. Para texto normal en alertas se usa `colorAccentDark`. Nunca texto blanco sobre `#E63946` en tamaño normal (4,2:1, no llega a 4,5:1).

## 3. Receta Glassmorphism (obligatoria)

Capas, de atrás hacia adelante:

1. **Fondo de pantalla:** degradado 135° `colorBg` → `colorBgGradientEnd`. Nunca fondo blanco liso.
2. **Superficie glass:**
   - `backgroundColor: colorGlassFill`
   - `borderWidth: 1`, `borderColor: colorGlassBorder`
   - `borderTopColor: colorBorderStrong` (brillo superior)
   - `borderRadius: radiusLg` (20)
   - sombra: `shadowColor: #000`, `shadowOpacity: 0.35`, `shadowRadius: 16`, `shadowOffset: {0, 8}`, `elevation: 8` en Android.
3. **Contenido:** padding mínimo 16, separación entre tarjetas 12.

Variantes:

| Variante | Relleno | Borde | Para qué |
|---|---|---|---|
| `glass` | 0,10 | `colorGlassBorder` | tarjetas, listas, encabezados |
| `glassStrong` | 0,16 | `rgba(255,255,255,0.28)` | modales, toast, bottom sheets |
| `glassInput` | 0,08 | 0,22 (foco: `colorPrimary` + brillo) | campos de formulario |
| `buttonPrimary` | `colorPrimary` sólido | sin borde | acción principal, texto blanco |
| `buttonGhost` | `glass` | `colorGlassBorder` | acción secundaria, texto blanco |

No se instala `expo-blur`: el vidrio se logra por capas de translucidez, borde y sombra (D-14).

## 4. Escala visual

- **Tipografía** (fuente del sistema, sin instalar fuentes): `display` 28/700 · `title` 22/700 · `subtitle` 17/600 · `body` 15/400 · `caption` 12/500.
- **Espacios:** 4, 8, 12, 16, 24, 32 (solo desde `theme.spacing`).
- **Radios:** `sm` 10 · `md` 16 · `lg` 20 · `pill` 999.

## 5. Los cuatro estados de cada pantalla

| Estado | Aspecto |
|---|---|
| Cargando | 3 esqueletos glass con opacidad animada (sin librerías) + texto «Cargando…» |
| Error | tarjeta `glassStrong`, icono en `colorAccentDark`, mensaje claro y botón «Reintentar» (`buttonPrimary`, 44 px) |
| Vacío | símbolo del pin al 30 % de opacidad, título `subtitle` y acción primaria |
| Pendiente | pastilla glass con punto `colorAccent` + contador (RF-09); icono y texto además del color |

## 6. Accesibilidad (RNF-04)

- Texto normal ≥ 4,5:1; iconos y bordes ≥ 3:1.
- Objetivos táctiles ≥ 44×44 px.
- Ningún estado se comunica solo con color: siempre icono + texto.
- El logo nunca compite con el contenido: un logo por pantalla como máximo.

## 7. Cómo se exige

1. Toda pantalla nueva se genera o se revisa con `frontend-designer` + skill `glassmorphism-ui`.
2. Criterio de cierre (TD-05): el agente reporta «cumple» en RF-D-01 a RF-D-05 de `specs/002-diseno-visual/spec.md`, y `npx tsc --noEmit` + `npx expo lint` pasan.
3. Un color, espacio o radio escrito a mano fuera de `theme.ts` es un hallazgo: se corrige en la tarea, no se anota para después.
