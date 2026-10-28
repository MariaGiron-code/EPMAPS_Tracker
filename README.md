# Registro de lecturas de medidores (Prueba I técnica)

Aplicación móvil para técnicos de EPMAPS que registra lecturas de medidores de agua, incluso sin señal.

## Documentación
- `docs/adr/`: decisiones de arquitectura (ADR-001 a ADR-008).
- `docs/historias/`: historias de usuario.
- `docs/constitution.md`: principios del proyecto.
- `docs/design-system.md`: sistema de diseño (Glassmorphism, paleta EPMAPS, logo).
- `assets/logo/`: logo oficial EPMAPS_Tracker (SVG fuente + PNG e icono).
- `specs/001-registro-lectura/`: decisiones, especificación, plan y tareas.
- `specs/002-diseno-visual/`: especificación y tareas del sistema de diseño.
- `AGENTS.md` y `MEMORY.md`: instrucciones y estado para agentes de IA.

## Agentes y skills
- `.opencode/agents/frontend-designer.md`: agente que genera y revisa todas las interfaces contra el design system.
- `.agents/skills/glassmorphism-ui/SKILL.md`: skill con el estilo visual obligatorio.
- `.agents/skills/`: además `sdd`, `grill-me`, `rn-conventions`, `academic-rules`.

## Flujo de trabajo
Este proyecto usa Specification-Driven Development. Consulta `.agents/skills/sdd/SKILL.md` para el orden de las fases.

## Ejecutar
```bash
npm install
npx expo start -c
```
Crea un archivo `.env` con las URLs de MockAPI cuando la tarea lo requiera.
