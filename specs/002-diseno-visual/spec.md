# Especificación: Sistema de diseño visual (EPMAPS_Tracker)

**Estado:** aprobada (27/10/2026)
**Alcance:** identidad, tokens y componentes glass de todas las pantallas de la app.
**Decisiones:** `specs/002-diseno-visual/decisiones.md`
**Fuente visual:** `docs/design-system.md`

## Requisitos funcionales

**RF-D-01 · Tokens (RNF-04)**
- Dado que creo o modifico una pantalla, cuando defino un color, espacio, radio o tamaño de fuente, entonces el valor proviene de `src/constants/theme.ts` y no hay literales de estilo en el archivo de la pantalla.
- Dado que necesito un tono nuevo de la marca, cuando lo agrego, entonces se añade a `theme.ts` y a `docs/design-system.md` con su justificación y contraste.

**RF-D-02 · Glassmorphism**
- Dado que muestro una tarjeta, campo o botón secundario, cuando lo veo, entonces aplica la receta glass completa (relleno translúcido, borde de 1 px, brillo superior, sombra y radio `lg`) sobre fondo con degradado.
- Dado que quiero un efecto de desenfoque, cuando reviso dependencias, entonces no se instaló ninguna: el vidrio se logra por translucidez, borde y sombra (D-14).

**RF-D-03 · Logo e identidad**
- Dado que abro el login, el encabezado principal o el icono de la app, cuando se muestra la marca, entonces aparece el logo oficial de `assets/logo/` sin deformar, sin recolorear y respetando su área de respeto.
- Dado que el fondo es oscuro, cuando coloco el logo, entonces uso el símbolo del pin o lo apoyo sobre una superficie glass clara, para que "Tracker" siga siendo legible.
- El nombre visible de la app es `EPMAPS_Tracker` en toda la documentación, títulos e ícono.

**RF-D-04 · Los cuatro estados con estilo glass**
- Dado que una pantalla carga, muestra un error, está vacía o tiene operación pendiente, cuando la veo, entonces cada estado usa los componentes glass reutilizables y tiene contenido real, no un `null`.
- Dado que comunico un estado, cuando lo reviso, entonces hay icono y texto además del color.

**RF-D-05 · Accesibilidad visual (RNF-04)**
- Dado que hay texto normal, cuando lo mido, entonces su contraste es ≥ 4,5:1 contra su fondo; iconos y bordes ≥ 3:1.
- Dado que hay una acción, cuando toco, entonces su objetivo mide al menos 44×44 px.
- Dado que uso `#E63946`, cuando reviso dónde aparece, entonces es en iconos, bordes, pastillas o texto en negrita ≥ 19 px; el texto de alerta normal usa `#B4232E`.

## Requisitos no funcionales

- **RNF-D-01 Sin dependencias:** el sistema de diseño no agrega paquetes (logo en PNG nativo, glass sin blur, tipografía del sistema).
- **RNF-D-02 Un solo lugar:** la fuente visual vive en `docs/design-system.md`; los valores ejecutables en `src/constants/theme.ts`. Si difieren, manda el design system.
- **RNF-D-03 Revisión obligatoria:** ninguna tarea de interfaz se marca `[x]` sin que el agente `frontend-designer` reporte «cumple» en RF-D-01 a RF-D-05.
