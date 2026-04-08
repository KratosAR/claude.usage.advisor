// extension.ts — Entry point for AI Usage Advisor VS Code extension

import * as vscode from 'vscode';
import { UsageStatusBar } from './statusBar';
import { UsagePanel } from './panel';

let statusBar: UsageStatusBar | undefined;

export function activate(context: vscode.ExtensionContext): void {
  try {
    statusBar = new UsageStatusBar(context);

    context.subscriptions.push(
      vscode.commands.registerCommand('usageAdvisor.openPanel', () => {
        if (statusBar) UsagePanel.show(context, statusBar);
      }),

      vscode.commands.registerCommand('usageAdvisor.addMessage', () => {
        statusBar?.addMessages(1);
      }),

      vscode.commands.registerCommand('usageAdvisor.resetTracker', () => {
        statusBar?.reset();
        void vscode.window.showInformationMessage('AI Usage Advisor: window reset.');
      }),

      vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('usageAdvisor')) {
          statusBar?.reset();
        }
      }),
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    void vscode.window.showErrorMessage(`AI Usage Advisor failed to activate: ${msg}`);
  }
}

export function deactivate(): void {
  statusBar?.dispose();
}
