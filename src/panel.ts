// panel.ts — WebView panel that renders the full tracker widget

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import type { UsageStatusBar } from './statusBar';

export class UsagePanel {
  private static current: UsagePanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private readonly disposables: vscode.Disposable[] = [];

  static show(context: vscode.ExtensionContext, statusBar: UsageStatusBar): void {
    if (UsagePanel.current) {
      UsagePanel.current.panel.reveal();
      return;
    }
    UsagePanel.current = new UsagePanel(context, statusBar);
  }

  private constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly statusBar: UsageStatusBar,
  ) {
    this.panel = vscode.window.createWebviewPanel(
      'usageAdvisor',
      'Claude Usage Advisor AR',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'media')),
          vscode.Uri.file(path.join(context.extensionPath, 'src')),
        ],
        retainContextWhenHidden: true,
      },
    );

    this.panel.webview.html = this.buildHtml();

    // Messages from the webview
    this.panel.webview.onDidReceiveMessage(
      (message: { command: string; value?: number | string }) => {
        switch (message.command) {
          case 'addMsgs':
            if (typeof message.value === 'number') {
              statusBar.addMessages(message.value);
              this.refresh();
            }
            break;
          case 'reset':
            statusBar.reset();
            this.refresh();
            break;
          case 'setProvider':
            void vscode.workspace.getConfiguration('usageAdvisor')
              .update('provider', message.value, vscode.ConfigurationTarget.Global)
              .then(() => this.refresh());
            break;
          case 'setPlan':
            void vscode.workspace.getConfiguration('usageAdvisor')
              .update('plan', message.value, vscode.ConfigurationTarget.Global)
              .then(() => this.refresh());
            break;
        }
      },
      undefined,
      this.disposables,
    );

    this.panel.onDidDispose(() => this.dispose(), undefined, this.disposables);

    // Refresh every second
    const ticker = setInterval(() => {
      if (this.panel.visible) this.refresh();
    }, 1000);
    this.disposables.push({ dispose: () => clearInterval(ticker) });
  }

  private refresh(): void {
    const state = this.statusBar.getState();
    void this.panel.webview.postMessage({ command: 'update', state });
  }

  private buildHtml(): string {
    const mediaPath = path.join(this.context.extensionPath, 'media');
    const htmlPath = path.join(mediaPath, 'panel.html');

    if (!fs.existsSync(htmlPath)) {
      return `<html><body><p style="font-family:sans-serif;padding:2rem">
        panel.html not found. Run the build step first.
      </p></body></html>`;
    }

    let html = fs.readFileSync(htmlPath, 'utf8');

    // Replace resource paths with webview URIs
    const mediaUri = this.panel.webview.asWebviewUri(
      vscode.Uri.file(mediaPath),
    );
    html = html.replace(/\{\{mediaUri\}\}/g, mediaUri.toString());

    // Inject CSP nonce
    const nonce = getNonce();
    html = html.replace(/\{\{nonce\}\}/g, nonce);
    html = html.replace(
      /<meta http-equiv="Content-Security-Policy"/,
      `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'nonce-${nonce}'"`,
    );

    return html;
  }

  private dispose(): void {
    UsagePanel.current = undefined;
    this.panel.dispose();
    this.disposables.forEach(d => d.dispose());
  }
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
