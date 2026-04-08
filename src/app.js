// usage-advisor-ar · src/app.js
// Tracker de uso de Claude para Argentina — datos en memoria de sesion

var plan = 'pro';
var msgs = 0;
var windowStart = new Date();

var PLANS = {
  free: { limit: 40,  window: 'dia',  name: 'Free' },
  pro:  { limit: 45,  window: '5 hs', name: 'Pro'  },
  max:  { limit: 225, window: '5 hs', name: 'Max'  }
};

var DAYS = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];

function getARTime() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
}

function pad(n) { return String(n).padStart(2, '0'); }

function getState(t) {
  var h = t.getHours(), day = t.getDay(), mins = h * 60 + t.getMinutes();
  if (day === 0 || day === 6 || h < 8) return 'turbo';
  if (mins >= 600 && mins < 960) return 'peak';
  return 'offpeak';
}

function minutesUntil(t, th, tm) {
  var cur = t.getHours() * 60 + t.getMinutes();
  var diff = th * 60 + tm - cur;
  if (diff <= 0) diff += 1440;
  return diff;
}

function fmtDiff(m) {
  return m < 60 ? m + ' min' : Math.floor(m / 60) + 'h ' + pad(m % 60) + 'min';
}

var CFG = {
  peak: {
    label: 'Horario pico',
    msg: 'Tu cuota se consume MAS RAPIDO ahora. Usa prompts completos, no mandes mensajitos cortos!',
    tips: [
      { i: '⚡', t: 'Abre chat nuevo para cada tema (menos historial = menos tokens)' },
      { i: '📝', t: 'Junta todo en UN solo mensaje en vez de ir de a poco' },
      { i: '🤖', t: 'Usa Sonnet para el dia a dia (Opus consume 3-5x mas cuota)' },
      { i: '⏰', t: 'Guarda sesiones intensas para despues de las 16:00 hs' },
    ],
    tipsTitle: 'Tips para horario pico',
    cd: function(t) { return 'Pico termina en ' + fmtDiff(minutesUntil(t, 16, 0)); }
  },
  offpeak: {
    label: 'Fuera de pico',
    msg: 'Cuota a ritmo normal. Dale con todo, la ventana de 5 horas esta a tu favor!',
    tips: [
      { i: '🚀', t: 'Buen momento para proyectos con archivos grandes o codigo largo' },
      { i: '💎', t: 'Podes usar Opus sin tanto costo de cuota' },
      { i: '📂', t: 'Ideal para subir contexto extenso y organizar proyectos' },
    ],
    tipsTitle: 'Momento ideal para trabajar',
    cd: function(t) {
      return (t.getHours() * 60 + t.getMinutes() < 600)
        ? 'Pico empieza en ' + fmtDiff(minutesUntil(t, 10, 0))
        : 'Proximo pico: manana 10:00 hs';
    }
  },
  turbo: {
    label: 'Modo turbo',
    msg: 'Madrugada o finde! Sin restricciones extra. El mejor momento para sesiones intensas.',
    tips: [
      { i: '🌙', t: 'Ideal para sesiones largas, evals o proyectos grandes' },
      { i: '💎', t: 'Usa Opus libremente, es el mejor momento' },
      { i: '⚡', t: 'Ventana de 5hs corre sin el multiplicador de pico' },
    ],
    tipsTitle: 'Aprovecha el modo turbo',
    cd: function(t) {
      var d = t.getDay();
      return d === 0 ? 'Sin pico hoy, es domingo'
           : d === 6 ? 'Sin pico hoy, es sabado'
           : 'Pico empieza en ' + fmtDiff(minutesUntil(t, 10, 0));
    }
  }
};

function setPlan(p) {
  plan = p;
  msgs = 0;
  windowStart = new Date();
  ['free', 'pro', 'max'].forEach(function(x) {
    var el = document.getElementById('tab-' + x);
    if (el) el.classList.toggle('active', x === p);
  });
  renderTracker();
}

function addMsgs(n) {
  var lim = PLANS[plan].limit;
  msgs = Math.max(0, Math.min(lim, msgs + n));
  renderTracker();
}

function resetTracker() {
  msgs = 0;
  windowStart = new Date();
  renderTracker();
}

function renderTracker() {
  var lim = PLANS[plan].limit;
  var pct = Math.round((msgs / lim) * 100);
  var rem = lim - msgs;

  setText('t-count', msgs);
  setText('t-of', '/ ' + lim + ' msgs');
  setText('t-rem', rem + ' restantes');
  setText('t-pct', pct + '% usado');
  setText('t-plan-name', PLANS[plan].name);

  var bar = document.getElementById('t-bar');
  if (bar) {
    bar.style.width = pct + '%';
    bar.className = 'bar ' + (pct < 60 ? 'safe' : pct < 85 ? 'warn' : 'danger');
  }

  var ws = windowStart;
  setText('t-started', pad(ws.getHours()) + ':' + pad(ws.getMinutes()));
}

function setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

function render() {
  var t = getARTime();
  var state = getState(t);
  var cfg = CFG[state];

  setText('b-clock', pad(t.getHours()) + ':' + pad(t.getMinutes()) + ':' + pad(t.getSeconds()));
  setText('b-day', DAYS[t.getDay()]);

  var banner = document.getElementById('banner');
  if (banner) banner.className = 'banner ' + state;

  var dot = document.getElementById('b-dot');
  if (dot) dot.className = 'b-dot ' + state;

  var label = document.getElementById('b-label');
  if (label) { label.className = 'b-label ' + state; label.textContent = cfg.label; }

  setText('b-countdown', cfg.cd(t));

  var msgEl = document.getElementById('b-msg');
  if (msgEl) { msgEl.className = 'b-msg ' + state; msgEl.textContent = cfg.msg; }

  setText('tips-title', cfg.tipsTitle);
  var tipsList = document.getElementById('tips-list');
  if (tipsList) {
    tipsList.innerHTML = cfg.tips.map(function(tip) {
      return '<div class="tip"><span class="tip-icon">' + tip.i + '</span><span>' + tip.t + '</span></div>';
    }).join('');
  }
}

// Arrancar
render();
renderTracker();
setInterval(render, 1000);
