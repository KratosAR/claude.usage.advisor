// statusBar.ts — VS Code status bar item for peak state + message counter

import * as vscode from 'vscode';
import { getARTimeForZone, getPeakState, PLANS, type PlanId } from './advisor';

const STATE_ICONS: Record<string, string> = {
  peak:    '$(circle-filled)',
  offpeak: '$(pass-filled)',
  turbo:   '$(moon)',
};

const STATE_COLORS: Record<string, vscode.ThemeColor> = {
  peak:    new vscode.ThemeColor('statusBarItem.warningBackground'),
  offpeak: new vscode.ThemeColor('statusBarItem.prominentBackground'),
  turbo:   new vscode.ThemeColor('statusBarItem.prominentBackground'),
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
    this.item.tooltip = 'Claude Usage Advisor AR — clic para abrir panel';
    this.context.subscriptions.push(this.item);

    // Restore persisted state
    this.msgs = context.globalState.get<number>('usageAdvisor.msgs', 0);
    const startIso = context.globalState.get<string>('usageAdvisor.windowStart');
    this.windowStart = startIso ? new Date(startIso) : new Date();

    this.item.show();
    this.update();
    this.ticker = setInterval(() => this.update(), 10_000);
  }

  addMessages(n: number): void {
    const plan = this.getPlan();
    const limit = PLANS[plan].limit;
    this.msgs = Math.max(0, Math.min(limit, this.msgs + n));
    void this.context.globalState.update('usageAdvisor.msgs', this.msgs);
    this.update();
    this.checkThreshold();
  }

  reset(): void {
    this.msgs = 0;
    this.windowStart = new Date();
    void this.context.globalState.update('usageAdvisor.msgs', 0);
    void this.context.globalState.update('usageAdvisor.windowStart', this.windowStart.toISOString());
    this.update();
  }

  getState(): { msgs: number; windowStart: Date; plan: PlanId } {
    return { msgs: this.msgs, windowStart: this.windowStart, plan: this.getPlan() };
  }

  dispose(): void {
    if (this.ticker !== undefined) {
      clearInterval(this.ticker);
    }
    this.item.dispose();
  }

  private getPlan(): PlanId {
    return vscode.workspace.getConfiguration('usageAdvisor').get<PlanId>('plan', 'pro');
  }

  private getTimezone(): string {
    return vscode.workspace.getConfiguration('usageAdvisor')
      .get<string>('timezone', 'America/Argentina/Buenos_Aires');
  }

  private update(): void {
    const t = getARTimeForZone(this.getTimezone());
    const state = getPeakState(t);
    const plan = this.getPlan();
    const limit = PLANS[plan].limit;
    const pct = Math.round((this.msgs / limit) * 100);

    const icon = STATE_ICONS[state];
    const planName = PLANS[plan].name;

    this.item.text = `${icon} ${this.msgs}/${limit} · ${planName}`;
    this.item.backgroundColor = pct >= 85 ? STATE_COLORS['peak'] : undefined;
  }

  private checkThreshold(): void {
    const plan = this.getPlan();
    const limit = PLANS[plan].limit;
    const pct = (this.msgs / limit) * 100;

    if (pct >= 80 && pct < 81) {
      void vscode.window.showWarningMessage(
        `⚠️ Claude Usage Advisor: llegaste al 80% de tu límite (${this.msgs}/${limit} msgs). ¡Cuidado!`,
        'Ver panel',
      ).then(action => {
        if (action === 'Ver panel') {
          void vscode.commands.executeCommand('usageAdvisor.openPanel');
        }
      });
    }

    if (this.msgs >= limit) {
      void vscode.window.showErrorMessage(
        `🛑 Claude Usage Advisor: límite alcanzado (${limit} msgs). Resetea la ventana cuando empiece una nueva.`,
        'Reiniciar',
      ).then(action => {
        if (action === 'Reiniciar') {
          this.reset();
        }
      });
    }
  }
}
