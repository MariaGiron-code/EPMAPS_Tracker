# Plan técnico — sistema de diseño

Traduce la spec en estructura concreta. **No instala ninguna dependencia** (RNF-D-01): no hay ADR nuevo porque no hay paquete nuevo.

## Dependencias

Ninguna. Logo en PNG con `Image` nativo, glass sin blur, tipografía del sistema (D-13, D-14, D-16).

## Estructura de archivos

```
assets/logo/
  epmaps-tracker-logo.svg      fuente de verdad del logo (original)
  epmaps-tracker-logo.png      @2x 1200×360, fondo transparente
  epmaps-tracker-logo-1x.png   @1x 600×180
  epmaps-tracker-icon.png      icono 1024×1024 (pin sobre #1C1C1E)
docs/
  design-system.md             fuente visual: paleta, glass, escala, estados, logo
.opencode/agents/
  frontend-designer.md         agente que genera y revisa interfaces
.agents/skills/
  glassmorphism-ui/SKILL.md    skill operativa del estilo
src/
  constants/theme.ts           tokens ejecutables (TD-01)
  components/glass/
    GlassView.tsx              superficie glass (variantes glass/glassStrong)
    GlassInput.tsx             campo con foco en colorPrimary
    GlassButton.tsx            buttonPrimary y buttonGhost (44 px)
    StateView.tsx              los cuatro estados: cargando, error, vacío, pendiente
    BrandLogo.tsx              logo con reglas de escala y fondo
app/                           pantallas; solo usan tokens y componentes anteriores
```

## Responsables

| Quién | Qué |
|---|---|
| `frontend-designer` (agente) | genera y revisa interfaces contra RF-D-01 a RF-D-05 |
| `glassmorphism-ui` (skill) | reglas operativas que quien implementa la tarea sigue paso a paso |
| Desarrollador | aprueba, ejecuta typecheck/lint y marca `tasks.md` |

## Riesgos y mitigación

- Hex sueltos en pantallas → checklist del agente y criterio de TD-01 (`grep` sin coincidencias fuera de `theme.ts`).
- `#E63946` no llega a 4,5:1 → uso restringido a acentos/iconos/texto ≥ 19 px; alerta en `#B4232E` (RF-D-05).
- "Tracker" (`#333333`) ilegible sobre fondo oscuro → regla de uso del logo: glass claro o solo el símbolo (RF-D-03).
- Diseño que se diluye al aparecer nuevas pantallas → RNF-D-03: ninguna tarea de interfaz se cierra sin el reporte del agente.
