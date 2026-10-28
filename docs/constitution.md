# Constitución del proyecto

Principios que no se negocian durante el desarrollo.

1. **Primero la spec, después el código.** Una funcionalidad sin RF no se implementa.
2. **Sin señal, nada se pierde.** Toda acción del técnico se guarda localmente antes de intentar enviarse.
3. **Ninguna lectura se duplica.** El envío es idempotente: el mismo identificador nunca crea dos registros.
4. **Cada dependencia tiene una razón escrita.** Sin ADR, no se instala.
5. **La IA escribe código, pero las decisiones son del equipo.** Cada decisión queda registrada con su alternativa descartada.
6. **Lo que no se verifica no está terminado.** Cada tarea se cierra con su criterio de aceptación comprobado en el teléfono o en el emulador.
