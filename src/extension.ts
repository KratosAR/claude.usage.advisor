// extension.ts — Entry point for Claude Usage Advisor AR VS Code extension

import * as vscode from 'vscode';
import { UsageStatusBar } from './statusBar';
import { UsagePanel } from './panel';

let statusBar: UsageStatusBar | undefined;

export function activate(context: vscode.ExtensionContext): void {
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
      void vscode.window.showInformationMessage('✅ Ventana de mensajes reiniciada.');
    }),

    // React to plan config changes — refresh status bar immediately
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('usageAdvisor')) {
        statusBar?.reset();
      }
    }),
  );
}

export function deactivate(): void {
  statusBar?.dispose();
}
