# 🧠 Usage Advisor AR

> Panel de monitoreo de uso de Claude para usuarios en Argentina.
> Horario pico, tracker de mensajes por plan y tips en tiempo real.

![Estado](https://img.shields.io/badge/estado-activo-brightgreen)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue)
![Hecho en](https://img.shields.io/badge/hecho%20en-Argentina-lightblue)

---

## ¿Qué hace?

- ⚡ **Detecta horario pico** en Argentina (lun-vie 10:00–16:00 hs) — cuando Anthropic consume tu cuota más rápido
- 📊 **Tracker de mensajes** por ventana de 5 horas, adaptado a tu plan (Free / Pro / Max)
- 💡 **Tips automáticos** según el estado actual del horario
- 🌙 **Modo turbo** para madrugadas y fines de semana
- 🎨 **Dark mode** automático por preferencia del sistema

## Demo rápida

Abrí `index.html` en tu navegador. No necesita servidor ni dependencias.

```bash
git clone https://github.com/TU_USUARIO/usage-advisor-ar.git
cd usage-advisor-ar
open index.html   # Mac
xdg-open index.html  # Linux
start index.html  # Windows
```

## Estructura

```
usage-advisor-ar/
├── index.html          ← App principal (standalone)
├── src/
│   └── app.js          ← Lógica de la app
├── skills/
│   └── usage-advisor-ar/
│       └── SKILL.md    ← Skill para Claude.ai
└── README.md
```

## Usar como Skill en Claude.ai

1. Descargá `usage-advisor-ar.skill` desde [Releases](../../releases)
2. En Claude.ai → Configuración → Skills → Instalar skill
3. Listo — Claude va a avisarte automáticamente del horario pico

## Límites de Claude (datos actualizados abril 2026)

| Plan | Precio | Límite | Ventana | Límite semanal |
|------|--------|--------|---------|----------------|
| Free | $0/mes | ~40 msgs | por día | No aplica |
| Pro  | $20/mes | ~45 msgs | por 5 horas | Solo top 5% |
| Max  | $100/mes | ~225 msgs | por 5 horas | Solo top 5% |

**Horario pico en Argentina:** lunes a viernes, 10:00–16:00 hs (UTC-3)
Equivale a 5am–11am PT, cuando Anthropic reduce los límites de sesión.

## Roadmap

- [ ] Extensión para VS Code
- [ ] Soporte para Cursor, Windsurf, Positron
- [ ] Notificaciones nativas del sistema
- [ ] Persistencia con localStorage (modo browser)
- [ ] Soporte multi-zona horaria

## Contribuir

PR bienvenido. Si sos de otro país y querés adaptar el horario pico, abrí un issue.

## Licencia

MIT — libre para usar, modificar y distribuir.

---

Hecho con ☕ en Argentina
