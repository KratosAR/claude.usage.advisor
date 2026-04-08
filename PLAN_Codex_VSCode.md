# Plan de producto y ejecución — claude.usage.advisor

## Diagnóstico rápido
- Madurez actual: **idea/nombre**.
- Riesgo principal: empezar por UI sin definir modelo de recomendación.
- Estrategia recomendada: primero reglas útiles (valor), luego capa visual.

## Objetivo del producto
Ayudar a usuarios de Codex/VS Code a mejorar prompts y reducir costo/iteraciones con sugerencias inmediatas y accionables.

## KPIs sugeridos
- Reducción del tamaño promedio de prompt (10–20%).
- Menos iteraciones por tarea.
- % de sugerencias aceptadas/aplicadas.
- Tiempo hasta “primer valor” < 60 segundos.

## Arquitectura propuesta (MVP)
1. **Extension Host** (TypeScript): comandos y acceso al editor.
2. **Analyzer Engine**: reglas locales (sin dependencia externa inicial).
3. **Webview UI**: dashboard de resultados y acciones rápidas.
4. **Storage local**: historial y preferencias.

## Plan de implementación
### Sprint 1
- Scaffold + comando base.
- Integración de selección de texto activo.
- Score simple + 5 reglas iniciales.

### Sprint 2
- Webview moderna con score, insights y prioridad.
- Botón “crear versión mejorada del prompt”.
- Persistencia de historial.

### Sprint 3
- Telemetría opcional (opt-in).
- Afinado de heurísticas.
- Pruebas E2E y empaquetado.

## Mejoras visuales prioritarias
1. Tarjetas por recomendación con iconografía de severidad.
2. Barra de score global + breakdown por dimensiones.
3. Sección “antes/después” para prompt original vs mejorado.
4. Estados vacíos bien diseñados (onboarding visual).

## Riesgos y mitigación
- **Ruido en recomendaciones** → reglas explicables y desactivables.
- **Baja confianza** → mostrar por qué se sugiere cada cambio.
- **Sobrecarga visual** → diseño minimalista y jerarquía clara.
