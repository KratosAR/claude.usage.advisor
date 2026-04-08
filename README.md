# claude.usage.advisor

> Actualización: ver análisis técnico puntual en `ANALISIS_REPO_Codex_2026-04-08.md`.


Estado actual: **repositorio en fase inicial (sin código funcional todavía)**.

## ¿De qué se trata este repo?
Por el nombre, la intención probable es construir una extensión/herramienta para **aconsejar uso de tokens/costos/prompts** durante el uso de Claude/Codex dentro de VS Code.

Hoy el repositorio contiene únicamente archivos base (`README`, `LICENSE`, `.gitignore`) y no hay:

- manifiesto de extensión de VS Code (`package.json`)
- código fuente (`src/`)
- pruebas automatizadas
- scripts de build/run

## ¿Cómo usarlo en Codex hoy?
Actualmente **no es utilizable todavía** como extensión en Codex porque no existe implementación.

Para que sea usable en Codex, se recomienda:

1. Definir un MVP técnico (qué mide/recomienda exactamente).
2. Crear extensión VS Code (TypeScript + `yo code` o plantilla equivalente).
3. Añadir comandos para análisis de prompts/consumo.
4. Agregar panel visual (Webview) para recomendaciones.
5. Documentar instalación y flujo de uso en este README.

## Propuesta de MVP
- Comando `Usage Advisor: Analyze Current Prompt`.
- Estimación simple de longitud (chars/tokens aproximados).
- Reglas de recomendación iniciales:
  - prompt demasiado largo
  - falta de contexto estructurado
  - ausencia de criterios de éxito
- Resultado en panel lateral con sugerencias accionables.

## Mejoras visuales sugeridas para la extensión VS Code
- **Dashboard limpio** con:
  - indicador de “calidad del prompt” (0–100)
  - bloques de recomendaciones por prioridad (Alta/Media/Baja)
  - chips de métricas (tokens, longitud, complejidad)
- Soporte de tema oscuro/claro nativo.
- Microinteracciones: resaltado al pasar mouse, badges de estado.
- Historial de últimas 5 evaluaciones.
- Botones rápidos: “Aplicar plantilla”, “Copiar prompt mejorado”.

## Plan por fases
### Fase 0 — Fundaciones (1–2 días)
- Scaffold de extensión VS Code.
- Configuración de lint/format/test.
- CI básica.

### Fase 1 — Núcleo (2–4 días)
- Motor de reglas heurísticas iniciales.
- Comando para analizar prompt seleccionado.
- Output en panel de resultados.

### Fase 2 — UI/UX (2–4 días)
- Webview con diseño consistente y responsive.
- Semáforos de prioridad, score general y acciones rápidas.
- Accesibilidad (contraste, teclado, labels).

### Fase 3 — Calidad y adopción (2–3 días)
- Tests unitarios del motor de recomendaciones.
- E2E mínimo del comando principal.
- Documentación de uso en Codex y publicación inicial.

## Backlog técnico recomendado
- `package.json` (extension manifest)
- `src/extension.ts`
- `src/analyzer/*`
- `src/webview/*`
- `test/*`
- `docs/architecture.md`
