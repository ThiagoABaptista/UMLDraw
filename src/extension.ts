import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('umlDraw.start', () => {
    const panel = vscode.window.createWebviewPanel(
      'umlDraw',
      'UMLDraw — Editor UML',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))]
      }
    );

    const bundleUri = panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, 'dist', 'bundle.js'))
    );

    const nonce = getNonce();
    panel.webview.html = getHtml(panel, bundleUri, nonce);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

function getHtml(panel: vscode.WebviewPanel, bundleUri: vscode.Uri, nonce: string) {
  const csp = `default-src 'none'; img-src ${panel.webview.cspSource} blob:; 
               style-src ${panel.webview.cspSource} 'unsafe-inline'; 
               script-src 'nonce-${nonce}';`;

  return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy" content="${csp}">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>UMLDraw</title>
      <style>
        html, body, #root { 
          height: 100%; 
          margin: 0; 
          padding: 0; 
        }
        
        .placing-mode {
          cursor: crosshair !important;
        }
        
        body {
          overflow: hidden;
        }
        
        textarea:focus {
          outline: none;
          border: 2px solid #2563eb !important;
        }
        .connecting-mode {
          cursor: crosshair !important;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${bundleUri}"></script>
    </body>
    </html>
  `;
}

function getNonce() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 32; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
