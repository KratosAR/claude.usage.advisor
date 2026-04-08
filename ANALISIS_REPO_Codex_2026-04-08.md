# Análisis técnico actualizado del repositorio (2026-04-08)

## 1) Estado observado en este entorno
### Archivos presentes
- `README.md`
- `PLAN_Codex_VSCode.md`
- `LICENSE`
- `.gitignore`

### Archivos ausentes clave para una extensión VS Code
- `package.json` (manifest obligatorio)
- `src/extension.ts` (entrypoint)
- `tsconfig.json`
- `vsc-extension-quickstart.md`
- `test/` con pruebas de comandos

## 2) Conclusión de diagnóstico
El repositorio está en una etapa de **definición de producto** (documentación y plan), pero no en etapa de ejecución técnica todavía.

## 3) ¿Cómo se usaría en Codex (objetivo)?
Flujo objetivo para un usuario:
1. Seleccionar prompt en el editor.
2. Ejecutar comando `Usage Advisor: Analyze Current Prompt`.
3. Ver score, métricas y recomendaciones en panel lateral.
4. Aplicar versión mejorada del prompt desde acción rápida.

## 4) ¿Se necesitan cambios?
Sí, cambios **imprescindibles**:
- Inicializar extensión VS Code funcional.
- Implementar motor de análisis de prompt.
- Construir webview para resultados.
- Añadir tests y CI.

## 5) Propuesta de mejoras visuales para VS Code
- Encabezado con score global + estado semafórico.
- Lista de recomendaciones en tarjetas con prioridad.
- Bloque “antes/después” con diff corto del prompt.
- Acciones rápidas fijas: copiar, reemplazar, insertar plantilla.
- Modo oscuro/claro nativo y accesibilidad por teclado.

## 6) Plan de acción recomendado (orden ejecutable)
### Paso A — Bootstrap técnico (día 1)
- Crear manifest y estructura base de extensión.
- Registrar comando principal.

### Paso B — Valor funcional (día 2–3)
- Implementar 5 reglas heurísticas de calidad de prompt.
- Conectar resultado a panel lateral.

### Paso C — UX visual (día 4–5)
- Implementar diseño de webview con tarjetas, score y CTAs.
- Añadir estados vacíos y de error.

### Paso D — Calidad y release (día 6–7)
- Tests unitarios del analizador.
- Test E2E del comando principal.
- Preparar release interna.

## 7) Definición de Done (MVP)
Se considera listo cuando:
- El comando analiza texto seleccionado sin fallar.
- El panel presenta score + mínimo 5 recomendaciones.
- Existe botón para generar/copiar prompt mejorado.
- Hay pruebas automáticas básicas en CI.
