// statusBar.ts — VS Code status bar item: real-time peak state + message counter

import * as vscode from 'vscode';
import {
  getTimeInZone, getPeakState, getPlanById, getDefaultPlanId,
  type ProviderId, type Plan,
} from './advisor';

const STATE_ICONS: Record<string, string> = {
  peak:    '$(circle-filled)',
  offpeak: '$(pass-filled)',
  turbo:   '$(moon)',
};

export class UsageStatusBar {
  private readonly item: vscode.StatusBarItem;
  private msgs = 0;
  private windowStart = new Date();
  private ticker: ReturnType<typeof setInterval> | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.item = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100,
    );
    this.item.command = 'usageAdvisor.openPanel';
    this.item.tooltip = 'AI Usage Advisor — click to open panel';
    this.context.subscriptions.push(this.item);

    this.msgs = context.globalState.get<number>('usageAdvisor.msgs', 0);
    const startIso = context.globalState.get<string>('usageAdvisor.windowStart');
    this.windowStart = startIso ? new Date(startIso) : new Date();

    this.item.show();
    this.update();
    this.ticker = setInterval(() => this.update(), 10_000);
  }

  addMessages(n: number): void {
    const plan = this.getActivePlan();
    this.msgs = Math.max(0, Math.min(plan.limit, this.msgs + n));
    void this.context.globalState.update('usageAdvisor.msgs', this.msgs);
    this.update();
    this.checkThreshold(plan);
  }

  reset(): void {
    this.msgs = 0;
    this.windowStart = new Date();
    void this.context.globalState.update('usageAdvisor.msgs', 0);
    void this.context.globalState.update('usageAdvisor.windowStart', this.windowStart.toISOString());
    this.update();
  }

  getState(): { msgs: number; windowStart: Date; provider: ProviderId; planId: string } {
    const cfg = this.getConfig();
    return { msgs: this.msgs, windowStart: this.windowStart, provider: cfg.provider, planId: cfg.planId };
  }

  dispose(): void {
    if (this.ticker !== undefined) clearInterval(this.ticker);
    this.item.dispose();
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private getConfig(): { provider: ProviderId; planId: string; timezone: string } {
    const cfg = vscode.workspace.getConfiguration('usageAdvisor');
    const provider = cfg.get<ProviderId>('provider', 'anthropic');
    const rawPlanId = cfg.get<string>('plan', getDefaultPlanId(provider));
    const timezone = this.resolveTimezone(cfg.get<string>('timezone', 'auto'));
    return { provider, planId: rawPlanId, timezone };
  }

  private resolveTimezone(tz: string): string {
    if (tz === 'auto' || !tz) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return tz;
  }

  private getActivePlan(): Plan {
    const { provider, planId } = this.getConfig();
    return getPlanById(provider, planId) ?? { id: planId, name: planId, price: '', limit: 40, window: 'day', badge: '' };
  }

  private update(): void {
    const { provider } = this.getConfig();
    const plan = this.getActivePlan();
    const state = getPeakState(provider);
    const pct = Math.round((this.msgs / plan.limit) * 100);

    const icon = STATE_ICONS[state];
    this.item.text = `${icon} ${this.msgs}/${plan.limit} · ${plan.name}`;
    this.item.backgroundColor = pct >= 85
      ? new vscode.ThemeColor('statusBarItem.warningBackground')
      : undefined;
  }

  private checkThreshold(plan: Plan): void {
    const pct = (this.msgs / plan.limit) * 100;

    if (pct >= 80 && pct < 81) {
      void vscode.window.showWarningMessage(
        `⚠️ AI Usage Advisor: 80% of limit reached (${this.msgs}/${plan.limit} msgs for ${plan.name})`,
        'Open panel',
      ).then(action => {
        if (action === 'Open panel') {
          void vscode.commands.executeCommand('usageAdvisor.openPanel');
        }
      });
    }

    if (this.msgs >= plan.limit) {
      void vscode.window.showErrorMessage(
        `🛑 AI Usage Advisor: limit reached (${plan.limit} msgs for ${plan.name}). Reset when a new window starts.`,
        'Reset',
      ).then(action => {
        if (action === 'Reset') this.reset();
      });
    }
  }
}
