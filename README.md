# Registro de lecturas de medidores (Prueba I técnica)

Aplicación móvil para técnicos de EPMAPS que registra lecturas de medidores de agua, incluso sin señal.

## Documentación
- `docs/adr/`: decisiones de arquitectura (ADR-001 a ADR-008).
- `docs/historias/`: historias de usuario.
- `docs/constitution.md`: principios del proyecto.
- `specs/001-registro-lectura/`: decisiones, especificación, plan y tareas.
- `AGENTS.md` y `MEMORY.md`: instrucciones y estado para agentes de IA.

## Flujo de trabajo
Este proyecto usa Specification-Driven Development. Consulta `.agents/skills/sdd/SKILL.md` para el orden de las fases.

## Ejecutar
```bash
npm install
npx expo start -c
```
Crea un archivo `.env` con las URLs de MockAPI cuando la tarea lo requiera.
