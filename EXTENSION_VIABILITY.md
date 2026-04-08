# Viabilidad: Usage Advisor AR como Extensión VS Code

## TL;DR

✅ **Totalmente viable.** El esfuerzo de desarrollo es bajo-medio y el valor para la comunidad es alto.

---

## ¿Qué sería la extensión?

Una extensión de VS Code que muestra en la **Status Bar** (barra inferior) el estado del
horario pico en tiempo real, con panel lateral para el tracker completo.

### Mockup de Status Bar

```
[  🔴 PICO · 23/45 msgs  ]   ←  clic abre el panel
[  🟢 OFF-PEAK · 5/45    ]
[  🌙 TURBO · 0/225      ]
```

---

## Stack técnico necesario

| Tecnología | Para qué | Dificultad |
|-----------|----------|------------|
| TypeScript | Lógica de la extensión | Media |
| VS Code Extension API | StatusBar, WebviewPanel, Commands | Media |
| Webview (HTML/CSS/JS) | Panel visual (es el mismo que ya tenemos) | Baja |
| `vsce` CLI | Empaquetar y publicar | Baja |

**Estimación:** 1–2 días de desarrollo para versión MVP.

---

## IDEs compatibles (que usan la misma API de VS Code)

| IDE | Compatible | Notas |
|-----|------------|-------|
| **VS Code** | ✅ Nativo | Base del proyecto |
| **Cursor** | ✅ Total | Fork de VS Code, usa mismas extensiones |
| **Windsurf (Codeium)** | ✅ Total | Fork de VS Code |
| **Positron (Posit)** | ✅ Total | Fork de VS Code para data science |
| **VSCodium** | ✅ Total | Build open-source de VS Code |
| **GitHub Codespaces** | ✅ Total | Corre VS Code en el browser |
| **Gitpod** | ✅ Total | Basado en VS Code |
| **Eclipse Theia** | ⚠️ Parcial | Soporta extensiones VS Code, pero con limitaciones |
| **JetBrains IDEs** | ❌ No | API diferente, requeriría plugin separado |
| **Zed** | ❌ No | API propia |

**Una sola extensión cubre ~7 IDEs.** Eso es enorme para el esfuerzo requerido.

---

## Estructura del proyecto extensión

```
usage-advisor-ar-vscode/
├── package.json          ← Manifiesto de la extensión
├── tsconfig.json
├── src/
│   ├── extension.ts      ← Entry point (activa StatusBar, comandos)
│   ├── statusBar.ts      ← Lógica del item en la barra inferior
│   ├── panel.ts          ← WebviewPanel con el HTML del tracker
│   └── advisor.ts        ← Lógica de horario pico y planes (misma que app.js)
├── media/
│   ├── panel.html        ← El HTML del widget adaptado a Webview
│   └── panel.js          ← JS del panel
└── README.md
```

---

## Features del MVP (v1.0)

- [ ] Status Bar con estado en tiempo real (pico / off-peak / turbo)
- [ ] Clic en Status Bar abre el panel WebView con el tracker completo
- [ ] Selector de plan persistido en `workspaceState` o `globalState` de VS Code
- [ ] Tracker de mensajes reseteado por ventana de 5 horas (auto o manual)
- [ ] Notificación cuando se acerca al 80% del límite

## Features v2.0

- [ ] Notificación nativa del sistema al llegar al límite
- [ ] Soporte multi-zona horaria (detectar automáticamente o configurar)
- [ ] Historial de sesiones en `globalState`
- [ ] Integración con la API de Anthropic (si/cuando expongan uso real)
- [ ] Estadísticas semanales

---

## Cómo publicar en el Marketplace

```bash
# Instalar herramientas
npm install -g @vscode/vsce

# Crear cuenta en https://marketplace.visualstudio.com/manage
# Crear Personal Access Token en Azure DevOps

# Empaquetar
vsce package

# Publicar
vsce publish
```

El proceso completo toma ~30 minutos la primera vez.

---

## Veredicto

| Criterio | Estado |
|----------|--------|
| Viabilidad técnica | ✅ Alta |
| Esfuerzo MVP | ✅ Bajo (1–2 días) |
| Cobertura de IDEs | ✅ Excelente (7+ IDEs con una extensión) |
| Valor para la comunidad | ✅ Alto (nadie hizo esto todavía) |
| Mantenimiento | ✅ Bajo (los datos de horario pico son estables) |

**Recomendación:** Arrancar con la extensión después de validar el HTML standalone.
El código JS ya está listo — solo hay que envolverlo en la API de VS Code.
