# Claude Usage Advisor AR

> Track your Claude usage in real time — peak hours, plan limits, and session counter, from Argentina.

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-007ACC?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER_ID.claude-usage-advisor-ar)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Español

### ¿Qué es?

**Claude Usage Advisor AR** es una herramienta para usuarios de Claude en Argentina que quieren aprovechar al máximo su plan.

Muestra en tiempo real:

- 🔴 **Horario pico** — lun-vie 10:00–16:00 hs AR (la cuota corre más rápido)
- 🟢 **Fuera de pico** — cuota a ritmo normal, el mejor momento para trabajar
- 🌙 **Modo turbo** — madrugadas y fines de semana sin restricciones extra

### Versiones disponibles

| Versión | Descripción |
|---------|-------------|
| **Web standalone** | `index.html` — abrí directo en el browser, sin instalación |
| **VS Code Extension** | Status bar en tiempo real + panel completo con clic |
| **Skill de Claude Code** | Banner automático en cada conversación (`usage-advisor-ar.skill`) |

### Extensión VS Code

La extensión muestra en la barra inferior del editor:

```
$(circle-filled) 12/45 · Pro     ← horario pico
$(pass-filled) 3/45 · Pro        ← fuera de pico
$(moon) 0/225 · Max              ← modo turbo
```

Clic en el ítem abre el panel completo con el tracker interactivo.

**Instalación desde fuente:**

```bash
git clone https://github.com/TU_USUARIO/claude-usage-advisor-ar
cd claude-usage-advisor-ar
npm install
npm run compile

# En VS Code: F5 para abrir una ventana de extensión de desarrollo
```

**Publicar en el Marketplace:**

```bash
npm install -g @vscode/vsce
vsce package     # genera .vsix
vsce publish     # requiere cuenta en marketplace.visualstudio.com
```

**Configuración:**

| Setting | Default | Descripción |
|---------|---------|-------------|
| `usageAdvisor.plan` | `pro` | Tu plan (`free` / `pro` / `max`) |
| `usageAdvisor.timezone` | `America/Argentina/Buenos_Aires` | Zona horaria |

**Comandos:**

| Comando | Descripción |
|---------|-------------|
| `Claude Usage Advisor: Abrir panel` | Abre el tracker completo |
| `Claude Usage Advisor: +1 mensaje` | Registra un mensaje enviado |
| `Claude Usage Advisor: Reiniciar ventana` | Resetea el contador |

### Skill para Claude Code

Instalá la skill directamente en tu configuración de Claude Code:

```bash
cp -r skills/usage-advisor-ar ~/.claude/skills/
```

Una vez instalada, Claude mostrará automáticamente el estado de horario pico al inicio de cada conversación.

### Límites por plan

| Plan | Precio | Límite | Ventana |
|------|--------|--------|---------|
| Free | $0/mes | ~40 msgs | por día |
| Pro  | $20/mes | ~45 msgs | por 5 horas |
| Max  | $100/mes | ~225 msgs | por 5 horas |

> El límite semanal de Pro/Max afecta solo al top 5% de usuarios (introducido en agosto 2025).

---

## English

### What is it?

**Claude Usage Advisor AR** is a usage tracking tool for Claude users in Argentina who want to make the most of their plan.

Shows in real time:

- 🔴 **Peak hours** — Mon–Fri 10:00–16:00 AR time (quota runs faster)
- 🟢 **Off-peak** — normal quota rate, best time for heavy work
- 🌙 **Turbo mode** — late nights and weekends, no extra restrictions

### Available versions

| Version | Description |
|---------|-------------|
| **Standalone web** | `index.html` — open directly in your browser, no install |
| **VS Code Extension** | Real-time status bar + full panel on click |
| **Claude Code Skill** | Auto banner in every conversation (`usage-advisor-ar.skill`) |

### VS Code Extension

Shows in the editor status bar:

```
$(circle-filled) 12/45 · Pro     ← peak hours
$(pass-filled) 3/45 · Pro        ← off-peak
$(moon) 0/225 · Max              ← turbo mode
```

Click the status bar item to open the full interactive tracker panel.

**Install from source:**

```bash
git clone https://github.com/YOUR_USERNAME/claude-usage-advisor-ar
cd claude-usage-advisor-ar
npm install
npm run compile

# In VS Code: press F5 to launch an extension development window
```

**Publish to the Marketplace:**

```bash
npm install -g @vscode/vsce
vsce package     # generates .vsix
vsce publish     # requires a marketplace.visualstudio.com account
```

**Settings:**

| Setting | Default | Description |
|---------|---------|-------------|
| `usageAdvisor.plan` | `pro` | Your plan (`free` / `pro` / `max`) |
| `usageAdvisor.timezone` | `America/Argentina/Buenos_Aires` | Your timezone |

**Commands:**

| Command | Description |
|---------|-------------|
| `Claude Usage Advisor: Abrir panel` | Opens the full tracker panel |
| `Claude Usage Advisor: +1 mensaje` | Records one sent message |
| `Claude Usage Advisor: Reiniciar ventana` | Resets the message counter |

### Claude Code Skill

Install the skill into your Claude Code config:

```bash
cp -r skills/usage-advisor-ar ~/.claude/skills/
```

Once installed, Claude will automatically display peak hour status at the start of every conversation.

### Plan limits

| Plan | Price | Limit | Window |
|------|-------|-------|--------|
| Free | $0/mo | ~40 msgs | per day |
| Pro  | $20/mo | ~45 msgs | per 5 hours |
| Max  | $100/mo | ~225 msgs | per 5 hours |

> The weekly limit on Pro/Max only affects the top 5% of users (introduced August 2025).

### Compatible IDEs

One extension, multiple editors:

| IDE | Compatible |
|-----|-----------|
| VS Code | ✅ |
| Cursor | ✅ |
| Windsurf | ✅ |
| VSCodium | ✅ |
| GitHub Codespaces | ✅ |
| Gitpod | ✅ |
| JetBrains | ❌ (different API) |

---

## Project structure

```
claude-usage-advisor-ar/
├── src/
│   ├── extension.ts     ← Extension entry point
│   ├── statusBar.ts     ← Status bar item logic
│   ├── panel.ts         ← WebView panel
│   └── advisor.ts       ← Peak hours + plan logic
├── media/
│   └── panel.html       ← Interactive tracker UI (WebView)
├── skills/
│   └── usage-advisor-ar/
│       └── SKILL.md     ← Claude Code skill
├── index.html           ← Standalone browser version
├── src/app.js           ← Standalone JS logic
└── package.json
```

## License

MIT — feel free to fork, adapt, and share.
