// advisor.ts — Core logic: peak hours (timezone-aware) + multi-provider plan limits

export type ProviderId = 'anthropic' | 'openai';
export type PeakState = 'peak' | 'offpeak' | 'turbo';

// ── Plan definitions ────────────────────────────────────────────────────────

export interface Plan {
  id: string;
  name: string;
  price: string;
  limit: number;
  window: string;
  badge: string;
}

/**
 * Peak windows defined in America/Los_Angeles (PT) — both providers throttle
 * based on US Pacific business hours.
 *
 * Anthropic: 5:00–11:00 PT  (confirmed, public)
 * OpenAI:    8:00–18:00 PT  (estimated from community reports)
 */
export const PROVIDER_PEAK: Record<ProviderId, { startH: number; endH: number }> = {
  anthropic: { startH: 5,  endH: 11 },
  openai:    { startH: 8,  endH: 18 },
};

export const PLANS: Record<ProviderId, Plan[]> = {
  anthropic: [
    { id: 'free', name: 'Claude Free',  price: '$0/mo',   limit: 40,  window: 'day',    badge: '~40 msgs/day'  },
    { id: 'pro',  name: 'Claude Pro',   price: '$20/mo',  limit: 45,  window: '5 hours', badge: '~45 msgs/5h'  },
    { id: 'max5', name: 'Claude Max 5×', price: '$100/mo', limit: 225, window: '5 hours', badge: '~225 msgs/5h' },
    { id: 'max20',name: 'Claude Max 20×',price: '$200/mo', limit: 900, window: '5 hours', badge: '~900 msgs/5h' },
  ],
  openai: [
    { id: 'free',   name: 'ChatGPT Free',  price: '$0/mo',  limit: 15,  window: '3 hours', badge: '~15 msgs/3h'  },
    { id: 'plus',   name: 'ChatGPT Plus',  price: '$20/mo', limit: 40,  window: '3 hours', badge: '~40 msgs/3h'  },
    { id: 'team',   name: 'ChatGPT Team',  price: '$30/mo', limit: 100, window: '3 hours', badge: '~100 msgs/3h' },
    { id: 'pro',    name: 'ChatGPT Pro',   price: '$200/mo',limit: 999, window: 'unlimited',badge: 'Unlimited'   },
    { id: 'codex',  name: 'Codex (API)',   price: 'pay-as-you-go', limit: 500, window: 'minute', badge: '500 RPM' },
  ],
};

// ── Time utilities ──────────────────────────────────────────────────────────

const DAYS_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAYS_ES = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

export function getTimeInZone(timezone: string): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
}

export function getPTTime(): Date {
  return getTimeInZone('America/Los_Angeles');
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

// ── Peak state ──────────────────────────────────────────────────────────────

/**
 * Peak state is always evaluated in PT (provider servers are in the US).
 * We show times translated to the user's local timezone.
 */
export function getPeakState(provider: ProviderId): PeakState {
  const pt = getPTTime();
  const { startH, endH } = PROVIDER_PEAK[provider];
  const day = pt.getDay();
  const mins = pt.getHours() * 60 + pt.getMinutes();

  // Weekend / outside business hours → turbo
  if (day === 0 || day === 6) return 'turbo';
  if (pt.getHours() < 6) return 'turbo';

  if (mins >= startH * 60 && mins < endH * 60) return 'peak';
  return 'offpeak';
}

// ── Peak info (localised) ───────────────────────────────────────────────────

export interface PeakInfo {
  state: PeakState;
  label: string;
  message: string;
  countdown: string;
  tips: Array<{ icon: string; text: string }>;
  tipsTitle: string;
}

export function getPeakInfo(provider: ProviderId, userTimezone: string): PeakInfo {
  const state = getPeakState(provider);
  const pt = getPTTime();
  const local = getTimeInZone(userTimezone);
  const { startH, endH } = PROVIDER_PEAK[provider];
  const providerName = provider === 'anthropic' ? 'Claude' : 'ChatGPT/Codex';
  const serverTZ = 'PT';

  // Convert PT peak window to user's local time for display
  const peakStartLocal = ptHourToLocal(startH, userTimezone);
  const peakEndLocal   = ptHourToLocal(endH,   userTimezone);

  switch (state) {
    case 'peak':
      return {
        state,
        label: 'Peak hours',
        message: `Your ${providerName} quota runs FASTER right now. Use complete prompts — don't send short follow-ups!`,
        countdown: `Peak ends in ${fmtDiff(minutesUntil(pt, endH, 0))} (${serverTZ})`,
        tipsTitle: 'Tips for peak hours',
        tips: [
          { icon: '⚡', text: 'Open a new chat for each topic (less history = fewer tokens)' },
          { icon: '📝', text: 'Batch everything into ONE message instead of going back and forth' },
          { icon: '🤖', text: provider === 'anthropic'
              ? 'Use Sonnet for daily work (Opus costs 3–5× more quota)'
              : 'Use GPT-4o-mini for light tasks (GPT-4o costs more quota)' },
          { icon: '⏰', text: `Save heavy sessions for after ${peakEndLocal} (your time)` },
        ],
      };

    case 'offpeak':
      return {
        state,
        label: 'Off-peak',
        message: `Quota at normal rate. Go for it — the window is on your side!`,
        countdown: (pt.getHours() * 60 + pt.getMinutes() < startH * 60)
          ? `Peak starts in ${fmtDiff(minutesUntil(pt, startH, 0))} (${serverTZ})`
          : `Next peak: tomorrow at ${peakStartLocal} (your time)`,
        tipsTitle: 'Best time to work',
        tips: [
          { icon: '🚀', text: 'Great moment for projects with large files or long code' },
          { icon: '💎', text: provider === 'anthropic'
              ? 'You can use Opus without burning through quota as fast'
              : 'Good time for GPT-4o with extended context' },
          { icon: '📂', text: 'Ideal for uploading large context and organizing projects' },
        ],
      };

    case 'turbo': {
      const day = pt.getDay();
      const cdText = day === 0 ? 'No peak today — it\'s Sunday'
                   : day === 6 ? 'No peak today — it\'s Saturday'
                   : `Peak starts in ${fmtDiff(minutesUntil(pt, startH, 0))} (${serverTZ})`;
      return {
        state,
        label: 'Turbo mode',
        message: 'Late night or weekend! No extra restrictions. Best time for intensive sessions.',
        countdown: cdText,
        tipsTitle: 'Make the most of turbo mode',
        tips: [
          { icon: '🌙', text: 'Ideal for long sessions, evals, or large projects' },
          { icon: '💎', text: provider === 'anthropic'
              ? 'Use Opus freely — best time for it'
              : 'Use GPT-4o freely — no peak throttling' },
          { icon: '⚡', text: 'Window runs without the peak multiplier' },
        ],
      };
    }
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a PT hour (0-23) to the user's local time string.
 * e.g. ptHourToLocal(11, 'America/Argentina/Buenos_Aires') → '16:00'
 */
function ptHourToLocal(ptHour: number, userTimezone: string): string {
  // Build a Date at the given PT hour today
  const ptStr = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });
  const base = new Date(`${ptStr} ${pad(ptHour)}:00:00 PST`);
  // Re-read in user timezone
  const localStr = base.toLocaleTimeString('en-US', {
    timeZone: userTimezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return localStr;
}

export function formatTime(t: Date): string {
  return `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
}

export function formatShortTime(t: Date): string {
  return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
}

export function getDayName(date: Date, lang: 'en' | 'es' = 'en'): string {
  return lang === 'es' ? DAYS_ES[date.getDay()] : DAYS_EN[date.getDay()];
}

export function getPlanById(provider: ProviderId, planId: string): Plan | undefined {
  return PLANS[provider].find(p => p.id === planId);
}

export function getDefaultPlanId(provider: ProviderId): string {
  return provider === 'anthropic' ? 'pro' : 'plus';
}
