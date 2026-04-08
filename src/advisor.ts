// advisor.ts — Core logic: peak hours + plan limits (AR timezone)

export type PlanId = 'free' | 'pro' | 'max';
export type PeakState = 'peak' | 'offpeak' | 'turbo';

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  limit: number;
  window: string;
}

export interface PeakInfo {
  state: PeakState;
  label: string;
  message: string;
  countdown: string;
  tips: Array<{ icon: string; text: string }>;
  tipsTitle: string;
}

export const PLANS: Record<PlanId, Plan> = {
  free: { id: 'free', name: 'Free',  price: '$0/mes',   limit: 40,  window: 'día' },
  pro:  { id: 'pro',  name: 'Pro',   price: '$20/mes',  limit: 45,  window: '5 hs' },
  max:  { id: 'max',  name: 'Max',   price: '$100/mes', limit: 225, window: '5 hs' },
};

const DAYS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

export function getARTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
}

export function getARTimeForZone(timezone: string): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
}

export function getDayName(date: Date): string {
  return DAYS[date.getDay()];
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function minutesUntil(t: Date, targetH: number, targetM: number): number {
  const cur = t.getHours() * 60 + t.getMinutes();
  let diff = targetH * 60 + targetM - cur;
  if (diff <= 0) diff += 1440;
  return diff;
}

function fmtDiff(m: number): string {
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${pad(m % 60)}min`;
}

export function getPeakState(t: Date): PeakState {
  const h = t.getHours();
  const day = t.getDay();
  const mins = h * 60 + t.getMinutes();
  if (day === 0 || day === 6 || h < 8) return 'turbo';
  if (mins >= 600 && mins < 960) return 'peak';
  return 'offpeak';
}

export function getPeakInfo(t: Date): PeakInfo {
  const state = getPeakState(t);

  switch (state) {
    case 'peak':
      return {
        state,
        label: 'Horario pico',
        message: 'Tu cuota se consume MÁS RÁPIDO ahora. Usá prompts completos, no mandes mensajitos cortos!',
        countdown: `Pico termina en ${fmtDiff(minutesUntil(t, 16, 0))}`,
        tipsTitle: 'Tips para horario pico',
        tips: [
          { icon: '⚡', text: 'Abrí chat nuevo para cada tema (menos historial = menos tokens)' },
          { icon: '📝', text: 'Juntá todo en UN solo mensaje en vez de ir de a poco' },
          { icon: '🤖', text: 'Usá Sonnet para el día a día (Opus consume 3-5x más cuota)' },
          { icon: '⏰', text: 'Guardá sesiones intensas para después de las 16:00 hs' },
        ],
      };

    case 'offpeak':
      return {
        state,
        label: 'Fuera de pico',
        message: 'Cuota a ritmo normal. ¡Dale con todo, la ventana de 5 horas está a tu favor!',
        countdown: (t.getHours() * 60 + t.getMinutes() < 600)
          ? `Pico empieza en ${fmtDiff(minutesUntil(t, 10, 0))}`
          : 'Próximo pico: mañana 10:00 hs',
        tipsTitle: 'Momento ideal para trabajar',
        tips: [
          { icon: '🚀', text: 'Buen momento para proyectos con archivos grandes o código largo' },
          { icon: '💎', text: 'Podés usar Opus sin tanto costo de cuota' },
          { icon: '📂', text: 'Ideal para subir contexto extenso y organizar proyectos' },
        ],
      };

    case 'turbo': {
      const day = t.getDay();
      const cdText = day === 0 ? 'Sin pico hoy, es domingo'
                   : day === 6 ? 'Sin pico hoy, es sábado'
                   : `Pico empieza en ${fmtDiff(minutesUntil(t, 10, 0))}`;
      return {
        state,
        label: 'Modo turbo',
        message: '¡Madrugada o finde! Sin restricciones extra. El mejor momento para sesiones intensas.',
        countdown: cdText,
        tipsTitle: 'Aprovechá el modo turbo',
        tips: [
          { icon: '🌙', text: 'Ideal para sesiones largas, evals o proyectos grandes' },
          { icon: '💎', text: 'Usá Opus libremente, es el mejor momento' },
          { icon: '⚡', text: 'Ventana de 5hs corre sin el multiplicador de pico' },
        ],
      };
    }
  }
}

export function formatTime(t: Date): string {
  return `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
}

export function formatShortTime(t: Date): string {
  return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
}
